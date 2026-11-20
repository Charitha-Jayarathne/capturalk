import SiteContent from '../models/SiteContent.js';

// @desc    Get site content by key (e.g. 'home', 'about', 'categories', 'albums')
// @route   GET /api/content/:key
// @access  Public
export const getContentByKey = async (req, res) => {
  try {
    const { key } = req.params;
    const record = await SiteContent.findOne({ key });
    if (!record) {
      return res.status(200).json({ success: true, data: null });
    }
    return res.status(200).json({ success: true, data: record.data });
  } catch (error) {
    console.error(`Error fetching content for key "${req.params.key}":`, error.message);
    return res.status(500).json({ success: false, message: 'Server error retrieving content' });
  }
};

// @desc    Save/Update site content by key
// @route   PUT /api/content/:key
// @access  Public
export const saveContentByKey = async (req, res) => {
  try {
    const { key } = req.params;
    const data = req.body;

    if (!data) {
      return res.status(400).json({ success: false, message: 'Content data is required' });
    }

    const updated = await SiteContent.findOneAndUpdate(
      { key },
      { key, data },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({ success: true, data: updated.data });
  } catch (error) {
    console.error(`Error saving content for key "${req.params.key}":`, error.message);
    return res.status(500).json({ success: false, message: 'Server error saving content' });
  }
};

