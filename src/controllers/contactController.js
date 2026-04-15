import Contact from "../models/contactModel.js";
import dotenv from 'dotenv';

dotenv.config();

//  Create new contact (POST)
export const createContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and message are required fields",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    const newContact = new Contact({ 
      name, 
      email, 
      phone: phone || '', 
      subject: subject || '',
      message,
      status: 'new'
    });
    
    await newContact.save();

    res.status(201).json({
      success: true,
      message: "Thank you for contacting us! We'll get back to you soon.",
      data: {
        id: newContact._id,
        name: newContact.name,
        email: newContact.email,
        createdAt: newContact.createdAt,
      },
    });
  } catch (error) {
    console.error("Error creating contact:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit contact form. Please try again later.",
      error: error.message,
    });
  }
};

//  Get all contacts (GET) - Admin only
export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching contacts",
      error: error.message,
    });
  }
};

// Get contact page data (contact info, social links, etc.)
export const getContactPageData = async (req, res) => {
  try {
    // This can be stored in database or environment variables
    // For now, returning static data that can be configured
    const contactPageData = {
      contactInfo: [
        {
          type: "email",
          title: "Email Us",
          detail: process.env.CONTACT_EMAIL || "support@free.com",
          link: `mailto:${process.env.CONTACT_EMAIL || "support@free.com"}`,
        },
        {
          type: "phone",
          title: "Call Us",
          detail: process.env.CONTACT_PHONE || "+91 98765 43210",
          link: `tel:${process.env.CONTACT_PHONE?.replace(/\s/g, '') || "+919876543210"}`,
        },
        {
          type: "address",
          title: "Visit Us",
          detail: process.env.CONTACT_ADDRESS || "Indore, Madhya Pradesh, India",
          link: process.env.CONTACT_MAP_LINK || "#",
        },
      ],
      socialLinks: [
        {
          name: "Instagram",
          icon: "instagram",
          url: process.env.SOCIAL_INSTAGRAM || "#",
          color: "hover:text-pink-500",
        },
        {
          name: "Facebook",
          icon: "facebook",
          url: process.env.SOCIAL_FACEBOOK || "#",
          color: "hover:text-blue-500",
        },
        {
          name: "Twitter",
          icon: "twitter",
          url: process.env.SOCIAL_TWITTER || "#",
          color: "hover:text-cyan-400",
        },
      ],
      pageTitle: "Let's Connect!",
      pageSubtitle: "Got questions? We'd love to hear from you! 💬",
    };

    res.status(200).json({
      success: true,
      data: contactPageData,
    });
  } catch (error) {
    console.error("Error fetching contact page data:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching contact page data",
      error: error.message,
    });
  }
};

// Update contact status (Admin only)
export const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['new', 'read', 'replied', 'resolved'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(', ')}`,
      });
    }

    // Find and update contact
    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    contact.status = status;
    contact.updatedAt = new Date();
    await contact.save();

    res.status(200).json({
      success: true,
      message: "Contact status updated successfully",
      data: contact,
    });
  } catch (error) {
    console.error("Error updating contact status:", error);
    res.status(500).json({
      success: false,
      message: "Error updating contact status",
      error: error.message,
    });
  }
};
