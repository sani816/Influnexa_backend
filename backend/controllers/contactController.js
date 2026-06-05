import Contact from "../models/Contact.js";

export const createContact = async (
  req,
  res
) => {
  try {
    const contact =
      await Contact.create(req.body);

    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};