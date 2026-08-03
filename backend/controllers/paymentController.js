import PaymentRequest from "../models/PaymentRequest.js";
import Creator from "../models/Creator.js";


// ======================================================
// SUBMIT PAYMENT REQUEST
// ======================================================

export const submitPaymentRequest = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      paymentApp,
      amount,
      transactionId,
      filterData,
    } = req.body;

    if (!name || !email || !phone || !paymentApp) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Payment screenshot is required.",
      });
    }

    const payment = await PaymentRequest.create({
      name,
      email: email.toLowerCase(),
      phone,
      paymentApp,
      amount: amount ||1,
      transactionId,
      screenshot: req.file.filename,
      filterData: filterData ? JSON.parse(filterData) : {},
      status: "Pending",
      approved: false,
      downloaded: false,
    });

    res.status(201).json({
      success: true,
      message: "Payment submitted successfully.",
      payment,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// ======================================================
// GET ALL PAYMENTS (ADMIN)
// ======================================================

export const getAllPayments = async (req, res) => {
  try {
    const payments = await PaymentRequest.find().sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      payments,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// ======================================================
// APPROVE PAYMENT
// ======================================================

export const approvePayment = async (req, res) => {
  try {
    const payment = await PaymentRequest.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found.",
      });
    }

    payment.status = "Approved";
    payment.approved = true;
    payment.downloaded = false;
    payment.approvedAt = new Date();

    await payment.save();

    res.json({
      success: true,
      message: "Payment Approved Successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// ======================================================
// REJECT PAYMENT
// ======================================================

export const rejectPayment = async (req, res) => {
  try {
    const payment = await PaymentRequest.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found.",
      });
    }

    payment.status = "Rejected";
    payment.approved = false;

    await payment.save();

    res.json({
      success: true,
      message: "Payment Rejected.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// ======================================================
// CHECK PAYMENT STATUS
// ======================================================

export const checkPaymentStatus = async (req, res) => {
  try {
    const email = req.params.email.toLowerCase();

    const payment = await PaymentRequest.findOne({
      email,
    }).sort({
      createdAt: -1,
    });

    if (!payment) {
      return res.json({
        approved: false,
        downloaded: false,
        status: "Not Found",
      });
    }

    res.json({
  success:true,
  paymentId: payment._id,
  approved: payment.approved,
  downloaded: payment.downloaded,
  status: payment.status,
});
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// ======================================================
// DOWNLOAD CREATORS
// ======================================================

export const downloadCSV = async (req, res) => {
  try {
    const email = req.body.email.toLowerCase();

    const filterData = req.body.filterData || {};

    const payment = await PaymentRequest.findOne({
      email,
      approved: true,
      downloaded: false,
    }).sort({
      createdAt: -1,
    });

    if (!payment) {
      return res.status(403).json({
        success: false,
        message: "Payment not approved or already used.",
      });
    }

    const creators = await Creator.find(filterData);

    payment.downloaded = true;
    payment.downloadedAt = new Date();

    await payment.save();

    res.json({
      success: true,
      creators,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// ======================================================
// RESET DOWNLOAD (ADMIN)
// ======================================================

export const lockDownload = async(req,res)=>{

try{


const payment = await PaymentRequest.findById(
req.params.id
);


if(!payment){

return res.status(404).json({

success:false,
message:"Payment not found"

});

}


payment.downloaded = true;
payment.downloadedAt = new Date();


await payment.save();


res.json({

success:true,
message:"Download locked"

});


}
catch(err){

res.status(500).json({

success:false,
message:err.message

});

}


};