const Lead = require('../models/Lead');
const Note = require('../models/Note');
const User = require('../models/User');

// @route   GET /api/leads
// @desc    Get all leads
// @access  Private
exports.getLeads = async (req, res) => {
  try {
    const { search, status, source, assignedTo } = req.query;

    const query = {};

    if (status) query.status = status;
    if (source) query.source = source;
    if (assignedTo) query.assignedTo = assignedTo;

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const leads = await Lead.find(query)
      .populate('assignedTo', 'name email')
      .populate({
        path: 'notes',
        populate: {
          path: 'createdBy',
          select: 'name email',
        },
      })
      .sort({ createdAt: -1 });

    res.json(leads);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Server error',
    });
  }
};

// @route   GET /api/leads/:id
// @desc    Get single lead
// @access  Private
exports.getLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate({
        path: 'notes',
        populate: {
          path: 'createdBy',
          select: 'name email',
        },
      });

    if (!lead) {
      return res.status(404).json({
        message: 'Lead not found',
      });
    }

    res.json(lead);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Server error',
    });
  }
};

// @route   GET /api/leads/:id/notes
// @desc    Get notes for a lead
// @access  Private
exports.getNotes = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    const notes = await Note.find({ lead: req.params.id })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   POST /api/leads
// @desc    Create a new lead
// @access  Private
exports.createLead = async (req, res) => {
  try {
    const {
      name,
      company,
      email,
      phone,
      source,
      assignedTo,
      status,
      dealValue,
    } = req.body;

    // Validate required fields
    if (!name || !company || !email || !phone) {
      return res.status(400).json({
        message: 'Please provide all required fields',
      });
    }

    // Create new lead
    const lead = new Lead({
      name,
      company,
      email,
      phone,
      source: source || 'Website',
      assignedTo: assignedTo || null,
      status: status || 'New',
      dealValue: dealValue || 0,
    });

    // Save lead
    await lead.save();

    // Populate assigned user
    await lead.populate('assignedTo', 'name email');

    res.status(201).json({
      message: 'Lead created successfully',
      lead,
    });
  } catch (error) {
    console.error('Create Lead Error:', error);

    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};

// @route   PUT /api/leads/:id
// @desc    Update lead
// @access  Private
exports.updateLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        message: 'Lead not found',
      });
    }

    const { name, company, email, phone, source, assignedTo, status, dealValue } = req.body;

    if (name !== undefined) lead.name = name;
    if (company !== undefined) lead.company = company;
    if (email !== undefined) lead.email = email;
    if (phone !== undefined) lead.phone = phone;
    if (source !== undefined) lead.source = source;
    if (assignedTo !== undefined) lead.assignedTo = assignedTo || null;
    if (status !== undefined) lead.status = status;
    if (dealValue !== undefined) lead.dealValue = dealValue;

    await lead.save();

    await lead.populate('assignedTo', 'name email');

    res.json({
      message: 'Lead updated successfully',
      lead,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Server error',
    });
  }
};

// @route   DELETE /api/leads/:id
// @desc    Delete lead
// @access  Private
exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        message: 'Lead not found',
      });
    }

    await Note.deleteMany({ lead: req.params.id });

    await Lead.findByIdAndDelete(req.params.id);

    res.json({
      message: 'Lead deleted successfully',
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Server error',
    });
  }
};

// @route   POST /api/leads/:id/notes
// @desc    Add note to lead
// @access  Private
exports.addNote = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        message: 'Note content is required',
      });
    }

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        message: 'Lead not found',
      });
    }

    const note = new Note({
      content,
      lead: req.params.id,
      createdBy: req.user?.userId || null,
    });

    await note.save();

    lead.notes.push(note._id);

    await lead.save();

    await note.populate('createdBy', 'name email');

    res.status(201).json({
      message: 'Note added successfully',
      note,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Server error',
    });
  }
};

// @route   GET /api/leads/dashboard/stats
// @desc    Dashboard stats
// @access  Private
exports.getDashboardStats = async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();
    const newLeads = await Lead.countDocuments({ status: 'New' });
    const qualifiedLeads = await Lead.countDocuments({ status: 'Qualified' });
    const wonLeads = await Lead.countDocuments({ status: 'Won' });
    const lostLeads = await Lead.countDocuments({ status: 'Lost' });

    const totalDealValueResult = await Lead.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$dealValue' },
        },
      },
    ]);

    const wonDealValueResult = await Lead.aggregate([
      {
        $match: {
          status: 'Won',
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$dealValue' },
        },
      },
    ]);

    res.json({
      totalLeads,
      newLeads,
      qualifiedLeads,
      wonLeads,
      lostLeads,
      totalDealValue: totalDealValueResult[0]?.total || 0,
      wonDealValue: wonDealValueResult[0]?.total || 0,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Server error',
    });
  }
};

// @route   GET /api/leads/users
// @desc    Get all users for assignment dropdown
// @access  Private
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}, '_id name email role').sort({ name: 1 });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};