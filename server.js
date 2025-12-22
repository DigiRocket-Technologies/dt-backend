import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import multer from "multer";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken"
import { connectDB } from "./config/db.js";
import blogRoutes from "./routes/blogRoutes.js";
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';
import loginRoutes from './routes/loginRoutes.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB in bytes
  },
});

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(
  cors({
    origin: ["https://digirocket.io", "https://www.digirocket.io", "http://localhost:5173"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Accept", "Authorization", "X-Requested-With"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.options(/.*/, cors());

app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));

app.use("/api/v1/login", loginRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/blog", blogRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/api/v1/sendcontactformmail", (req, res) => {
  try {
    const { name, phone, website, company_name, additional, email } = req.body;

    if (!name || !phone || !website || !email) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required  details",
      });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter valid email",
      });
    }

    const auth = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "gmail",
      secure: true,
      port: 587,
      auth: {
        user: process.env.GMAIL_ACCOUNT,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const subject = "New lead from Digirocket website";

    const receiver = {
      from: process.env.GMAIL_ACCOUNT,
      to: process.env.TO,
      cc: [process.env.CC1, process.env.CC2, process.env.CC3, process.env.CC4, process.env.CC5],
      subject: subject,
      html: `<div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; margin: 0;">
      <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); max-width: 500px; margin: auto;">
        <h2 style="color: #333333; text-align: center;">Contact Details</h2>
    
        <div style="margin-bottom: 15px; padding: 10px; background-color: #f9f9f9; border-left: 4px solid #4CAF50; border-radius: 4px;">
          <div style="font-weight: bold; color: #555555;">Name:</div>
          <div style="color: #333333; margin-top: 5px;">${name}</div>
        </div>
    
        <div style="margin-bottom: 15px; padding: 10px; background-color: #f9f9f9; border-left: 4px solid #4CAF50; border-radius: 4px;">
          <div style="font-weight: bold; color: #555555;">Company Name:</div>
          <div style="color: #333333; margin-top: 5px;">${company_name}</div>
        </div>
    
        <div style="margin-bottom: 15px; padding: 10px; background-color: #f9f9f9; border-left: 4px solid #4CAF50; border-radius: 4px;">
          <div style="font-weight: bold; color: #555555;">Phone:</div>
          <div style="color: #333333; margin-top: 5px;">${phone}</div>
        </div>
    
        <div style="margin-bottom: 15px; padding: 10px; background-color: #f9f9f9; border-left: 4px solid #4CAF50; border-radius: 4px;">
          <div style="font-weight: bold; color: #555555;">Email:</div>
          <div style="color: #333333; margin-top: 5px;">${email}</div>
        </div>
    
        <div style="margin-bottom: 15px; padding: 10px; background-color: #f9f9f9; border-left: 4px solid #4CAF50; border-radius: 4px;">
          <div style="font-weight: bold; color: #555555;">Website:</div>
          <div style="color: #333333; margin-top: 5px;">
            <a href="${website}" target="_blank" style="color: #1a73e8; text-decoration: none;">${website}</a>
          </div>
        </div>
    
        <div style="margin-bottom: 15px; padding: 10px; background-color: #f9f9f9; border-left: 4px solid #4CAF50; border-radius: 4px;">
          <div style="font-weight: bold; color: #555555;">Additional Info:</div>
          <div style="color: #333333; margin-top: 5px;">${additional}</div>
        </div>
      </div>
    </div>`,
    };

    auth.sendMail(receiver, (err, emailResponse) => {
      if (err) {
        console.log(err);
        return res.json({
          success: false,
          message: "There was an error while saving the data",
        });
      } else {
        return res.json({
          success: true,
          message: "Form saved successfully",
        });
      }
    });
  } catch (err) {
    console.log("Error in contactformmail", err);
    return res.json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

app.post("/api/v1/senddropshippingformmail", (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      question1,
      question1Details,
      question2,
      question2Details,
      question3,
      question4,
    } = req.body;

    if (!name || !phone || !email || !question3 || !question4) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required  details",
      });
    }

    if (question1 === "Yes" && !question1Details) {
      return res.status(400).json({
        success: false,
        message: "Please fill website url",
      });
    }

    if (question2 === "Yes" && !question2Details) {
      return res.status(400).json({
        success: false,
        message: "Please fill company name",
      });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter valid email",
      });
    }

    const auth = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "gmail",
      secure: true,
      port: 587,
      auth: {
        user: process.env.GMAIL_ACCOUNT,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const subject = "New lead from Digirocket website";

    const receiver = {
      from: process.env.GMAIL_ACCOUNT,
      to: process.env.TO,
      cc: [process.env.CC1, process.env.CC2, process.env.CC3, process.env.CC4, process.env.CC5],
      subject: subject,
      html: `<div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; margin: 0;">
      <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); max-width: 500px; margin: auto;">
        <h2 style="color: #333333; text-align: center;">Contact Details</h2>
    
        <div style="margin-bottom: 15px; padding: 10px; background-color: #f9f9f9; border-left: 4px solid #4CAF50; border-radius: 4px;">
          <div style="font-weight: bold; color: #555555;">Name:</div>
          <div style="color: #333333; margin-top: 5px;">${name}</div>
        </div>
    
        <div style="margin-bottom: 15px; padding: 10px; background-color: #f9f9f9; border-left: 4px solid #4CAF50; border-radius: 4px;">
          <div style="font-weight: bold; color: #555555;">Company Name:</div>
          <div style="color: #333333; margin-top: 5px;">${question2Details ? question2Details : "NA"
        }</div>
        </div>
    
        <div style="margin-bottom: 15px; padding: 10px; background-color: #f9f9f9; border-left: 4px solid #4CAF50; border-radius: 4px;">
          <div style="font-weight: bold; color: #555555;">Phone:</div>
          <div style="color: #333333; margin-top: 5px;">${phone}</div>
        </div>
    
        <div style="margin-bottom: 15px; padding: 10px; background-color: #f9f9f9; border-left: 4px solid #4CAF50; border-radius: 4px;">
          <div style="font-weight: bold; color: #555555;">Email:</div>
          <div style="color: #333333; margin-top: 5px;">${email}</div>
        </div>
    
        <div style="margin-bottom: 15px; padding: 10px; background-color: #f9f9f9; border-left: 4px solid #4CAF50; border-radius: 4px;">
          <div style="font-weight: bold; color: #555555;">Website:</div>
          <div style="color: #333333; margin-top: 5px;">
            <a href="${question1Details ? question1Details : "#"
        }" target="_blank" style="color: #1a73e8; text-decoration: none;">${question1Details ? question1Details : "NA"
        }</a>
          </div>
        </div>
    
        <div style="margin-bottom: 15px; padding: 10px; background-color: #f9f9f9; border-left: 4px solid #4CAF50; border-radius: 4px;">
          <div style="font-weight: bold; color: #555555;">Have you tried hands-on dropshipping ?</div>
          <div style="color: #333333; margin-top: 5px;">${question3}</div>
        </div>

         <div style="margin-bottom: 15px; padding: 10px; background-color: #f9f9f9; border-left: 4px solid #4CAF50; border-radius: 4px;">
          <div style="font-weight: bold; color: #555555;">Do you want to pursue dropshipping as full-time or side income?</div>
          <div style="color: #333333; margin-top: 5px;">${question4}</div>
        </div>
      </div>
    </div>`,
    };

    auth.sendMail(receiver, (err, emailResponse) => {
      if (err) {
        console.log(err);
        return res.json({
          success: false,
          message: "There was an error while saving the data",
        });
      } else {
        return res.json({
          success: true,
          message: "Form saved successfully",
        });
      }
    });
  } catch (err) {
    console.log("Error in dropshippingformmail", err);
    return res.json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

app.post("/api/v1/sendwebappmail", (req, res) => {
  try {
    const { email, phone, name, websiteType, otherWebsiteType, additional } =
      req.body;

    if (!name || !phone || !websiteType || !email) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required  details",
      });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter valid email",
      });
    }

    if (websiteType === "Others" && !otherWebsiteType) {
      return res.status(400).json({
        success: false,
        message: "Please enter website type",
      });
    }

    const auth = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "gmail",
      secure: true,
      port: 587,
      auth: {
        user: process.env.GMAIL_ACCOUNT,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const subject = "New lead from Digirocket website";

    const receiver = {
      from: process.env.GMAIL_ACCOUNT,
      to: process.env.TO,
      cc: [process.env.CC1, process.env.CC2, process.env.CC3, process.env.CC4, process.env.CC5],
      subject: subject,
      html: `<div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; margin: 0;">
      <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); max-width: 500px; margin: auto;">
        <h2 style="color: #333333; text-align: center;">Contact Details</h2>
    
        <div style="margin-bottom: 15px; padding: 10px; background-color: #f9f9f9; border-left: 4px solid #4CAF50; border-radius: 4px;">
          <div style="font-weight: bold; color: #555555;">Name:</div>
          <div style="color: #333333; margin-top: 5px;">${name}</div>
        </div>
    
        <div style="margin-bottom: 15px; padding: 10px; background-color: #f9f9f9; border-left: 4px solid #4CAF50; border-radius: 4px;">
          <div style="font-weight: bold; color: #555555;">Phone:</div>
          <div style="color: #333333; margin-top: 5px;">${phone}</div>
        </div>
    
        <div style="margin-bottom: 15px; padding: 10px; background-color: #f9f9f9; border-left: 4px solid #4CAF50; border-radius: 4px;">
          <div style="font-weight: bold; color: #555555;">Email:</div>
          <div style="color: #333333; margin-top: 5px;">${email}</div>
        </div>
    
        <div style="margin-bottom: 15px; padding: 10px; background-color: #f9f9f9; border-left: 4px solid #4CAF50; border-radius: 4px;">
          <div style="font-weight: bold; color: #555555;">Website Type:</div>
          <div style="color: #333333; margin-top: 5px;">
            <div style="color: #333333; margin-top: 5px;">${websiteType}</div>
          </div>
        </div>

        <div style="margin-bottom: 15px; padding: 10px; background-color: #f9f9f9; border-left: 4px solid #4CAF50; border-radius: 4px;">
          <div style="font-weight: bold; color: #555555;">Website Type:</div>
          <div style="color: #333333; margin-top: 5px;">
            <div style="color: #333333; margin-top: 5px;">${websiteType === "Others" ? otherWebsiteType : websiteType
        }</div>
          </div>
        </div>
    
        <div style="margin-bottom: 15px; padding: 10px; background-color: #f9f9f9; border-left: 4px solid #4CAF50; border-radius: 4px;">
          <div style="font-weight: bold; color: #555555;">Additional Info:</div>
          <div style="color: #333333; margin-top: 5px;">${additional ? additional : "NA"
        }</div>
        </div>
      </div>
    </div>`,
    };

    auth.sendMail(receiver, (err, emailResponse) => {
      if (err) {
        console.log(err);
        return res.json({
          success: false,
          message: "There was an error while saving the data",
        });
      } else {
        return res.json({
          success: true,
          message: "Form saved successfully",
        });
      }
    });
  } catch (err) {
    console.log("Error in webappcontroller", err);
    return res.json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

app.post("/api/v1/sendmobileappmail", (req, res) => {
  try {
    const { email, phone, name, appType, additional } = req.body;
    if (!name || !phone || !appType || !email) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required  details",
      });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter valid email",
      });
    }

    const auth = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "gmail",
      secure: true,
      port: 587,
      auth: {
        user: process.env.GMAIL_ACCOUNT,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const subject = "New lead from Digirocket website";

    const receiver = {
      from: process.env.GMAIL_ACCOUNT,
      to: process.env.TO,
      cc: [process.env.CC1, process.env.CC2, process.env.CC3, process.env.CC4, process.env.CC5],
      subject: subject,
      html: `<div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; margin: 0;">
  <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); max-width: 500px; margin: auto;">
    <h2 style="color: #333333; text-align: center;">Contact Details</h2>

    <div style="margin-bottom: 15px; padding: 10px; background-color: #f9f9f9; border-left: 4px solid #4CAF50; border-radius: 4px;">
      <div style="font-weight: bold; color: #555555;">Name:</div>
      <div style="color: #333333; margin-top: 5px;">${name}</div>
    </div>

    <div style="margin-bottom: 15px; padding: 10px; background-color: #f9f9f9; border-left: 4px solid #4CAF50; border-radius: 4px;">
      <div style="font-weight: bold; color: #555555;">Email:</div>
      <div style="color: #333333; margin-top: 5px;">${email}</div>
    </div>

    <div style="margin-bottom: 15px; padding: 10px; background-color: #f9f9f9; border-left: 4px solid #4CAF50; border-radius: 4px;">
      <div style="font-weight: bold; color: #555555;">Phone:</div>
      <div style="color: #333333; margin-top: 5px;">${phone}</div>
    </div>

    <div style="margin-bottom: 15px; padding: 10px; background-color: #f9f9f9; border-left: 4px solid #4CAF50; border-radius: 4px;">
      <div style="font-weight: bold; color: #555555;">App Type:</div>
      <div style="color: #333333; margin-top: 5px;">${appType}</div>
    </div>

    <div style="margin-bottom: 15px; padding: 10px; background-color: #f9f9f9; border-left: 4px solid #4CAF50; border-radius: 4px;">
      <div style="font-weight: bold; color: #555555;">Additional Info:</div>
      <div style="color: #333333; margin-top: 5px;">${additional ? additional : "NA"
        }</div>
    </div>
  </div>
</div>`,
    };

    auth.sendMail(receiver, (err, emailResponse) => {
      if (err) {
        console.log(err);
        return res.json({
          success: false,
          message: "There was an error while saving the data",
        });
      } else {
        return res.json({
          success: true,
          message: "Form saved successfully",
        });
      }
    });
  } catch (err) {
    console.log("Error in mobileappmail", err);
    return res.json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

app.post("/api/v1/influencer", (req, res) => {
  try {
    const { name, email, phone, socialMedia, additional } = req.body;

    if (!name || !phone || socialMedia.length === 0 || !email) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required  details",
      });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter valid email",
      });
    }

    const auth = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "gmail",
      secure: true,
      port: 587,
      auth: {
        user: process.env.GMAIL_ACCOUNT,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const subject = "New lead from Digirocket website";

    const receiver = {
      from: process.env.GMAIL_ACCOUNT,
      to: process.env.TO,
      cc: [process.env.CC1, process.env.CC2, process.env.CC3, process.env.CC4, process.env.CC5],
      subject: subject,
      html: `<div style="font-family: Arial, sans-serif; background-color: #f0f0f0; padding: 20px; margin: 0;">
  <div style="background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1); max-width: 550px; margin: auto;">
    <h2 style="color: #2c3e50; text-align: center; margin-bottom: 20px;">Contact Information</h2>

    <div style="margin-bottom: 15px; padding: 12px; background-color: #f8f8f8; border-left: 4px solid #3498db; border-radius: 5px;">
      <div style="font-weight: bold; color: #4a4a4a;">Name:</div>
      <div style="color: #2c3e50; margin-top: 5px;">${name}</div>
    </div>

    <div style="margin-bottom: 15px; padding: 12px; background-color: #f8f8f8; border-left: 4px solid #3498db; border-radius: 5px;">
      <div style="font-weight: bold; color: #4a4a4a;">Email:</div>
      <div style="color: #2c3e50; margin-top: 5px;">${email}</div>
    </div>

    <div style="margin-bottom: 15px; padding: 12px; background-color: #f8f8f8; border-left: 4px solid #3498db; border-radius: 5px;">
      <div style="font-weight: bold; color: #4a4a4a;">Phone:</div>
      <div style="color: #2c3e50; margin-top: 5px;">${phone}</div>
    </div>

    <div style="margin-bottom: 15px; padding: 12px; background-color: #f8f8f8; border-left: 4px solid #3498db; border-radius: 5px;">
      <div style="font-weight: bold; color: #4a4a4a;">Platforms:</div>
      <div style="color: #2c3e50; margin-top: 5px;">
        ${socialMedia && socialMedia.length > 0
          ? socialMedia.join(", ")
          : "None"
        }
      </div>
    </div>

    <div style="margin-bottom: 15px; padding: 12px; background-color: #f8f8f8; border-left: 4px solid #3498db; border-radius: 5px;">
      <div style="font-weight: bold; color: #4a4a4a;">Additional Info:</div>
      <div style="color: #2c3e50; margin-top: 5px;">${additional ? additional : "Not Provided"
        }</div>
    </div>
  </div>
</div>`,
    };

    auth.sendMail(receiver, (err, emailResponse) => {
      if (err) {
        return res.json({
          success: false,
          message: "There was an error while saving the data",
        });
      } else {
        return res.json({
          success: true,
          message: "Form saved successfully",
        });
      }
    });
  } catch (err) {
    console.log("Error in influencermail", err);
    return res.json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

app.post("/api/v1/ecommerce", (req, res) => {
  try {
    const { name, email, phone, additional } = req.body;

    if (!name || !phone || !email) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required  details",
      });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter valid email",
      });
    }

    const auth = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "gmail",
      secure: true,
      port: 587,
      auth: {
        user: process.env.GMAIL_ACCOUNT,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const subject = "New lead from Digirocket website";

    const receiver = {
      from: process.env.GMAIL_ACCOUNT,
      to: process.env.TO,
      cc: [process.env.CC1, process.env.CC2, process.env.CC3, process.env.CC4, process.env.CC5],
      subject: subject,
      html: `<div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; margin: 0;">
      <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); max-width: 500px; margin: auto;">
        <h2 style="color: #333333; text-align: center;">Contact Details</h2>
    
        <div style="margin-bottom: 15px; padding: 10px; background-color: #f9f9f9; border-left: 4px solid #4CAF50; border-radius: 4px;">
          <div style="font-weight: bold; color: #555555;">Name:</div>
          <div style="color: #333333; margin-top: 5px;">${name}</div>
        </div>
    
        <div style="margin-bottom: 15px; padding: 10px; background-color: #f9f9f9; border-left: 4px solid #4CAF50; border-radius: 4px;">
          <div style="font-weight: bold; color: #555555;">Email:</div>
          <div style="color: #333333; margin-top: 5px;">${email}</div>
        </div>
    
        <div style="margin-bottom: 15px; padding: 10px; background-color: #f9f9f9; border-left: 4px solid #4CAF50; border-radius: 4px;">
          <div style="font-weight: bold; color: #555555;">Phone:</div>
          <div style="color: #333333; margin-top: 5px;">${phone}</div>
        </div>
    
      
        <div style="margin-bottom: 15px; padding: 10px; background-color: #f9f9f9; border-left: 4px solid #4CAF50; border-radius: 4px;">
          <div style="font-weight: bold; color: #555555;">Describe Your Query :</div>
          <div style="color: #333333; margin-top: 5px;">${additional ? additional : "NA"
        }</div>
        </div>
      </div>
    </div>`,
    };

    auth.sendMail(receiver, (err, emailResponse) => {
      if (err) {
        return res.json({
          success: false,
          message: "There was an error while saving the data",
        });
      } else {
        return res.json({
          success: true,
          message: "Form saved successfully",
        });
      }
    });
  } catch (err) {
    return res.json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

app.post("/api/v1/sendaimail", (req, res) => {
  try {
    const { name, email, phone, aiService, additional } = req.body;

    if (!name || !phone || !aiService || !email) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required  details",
      });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter valid email",
      });
    }

    const auth = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "gmail",
      secure: true,
      port: 587,
      auth: {
        user: process.env.GMAIL_ACCOUNT,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const subject = "New lead from Digirocket website";

    const receiver = {
      from: process.env.GMAIL_ACCOUNT,
      to: process.env.TO,
      cc: [process.env.CC1, process.env.CC2, process.env.CC3, process.env.CC4, process.env.CC5],
      subject: subject,
      html: `<div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; margin: 0;">
      <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); max-width: 500px; margin: auto;">
        <h2 style="color: #333333; text-align: center;">Contact Details</h2>
    
        <div style="margin-bottom: 15px; padding: 10px; background-color: #f9f9f9; border-left: 4px solid #4CAF50; border-radius: 4px;">
          <div style="font-weight: bold; color: #555555;">Name:</div>
          <div style="color: #333333; margin-top: 5px;">${name}</div>
        </div>
    
        <div style="margin-bottom: 15px; padding: 10px; background-color: #f9f9f9; border-left: 4px solid #4CAF50; border-radius: 4px;">
          <div style="font-weight: bold; color: #555555;">Email:</div>
          <div style="color: #333333; margin-top: 5px;">${email}</div>
        </div>
    
        <div style="margin-bottom: 15px; padding: 10px; background-color: #f9f9f9; border-left: 4px solid #4CAF50; border-radius: 4px;">
          <div style="font-weight: bold; color: #555555;">Phone:</div>
          <div style="color: #333333; margin-top: 5px;">${phone}</div>
        </div>
    
        <div style="margin-bottom: 15px; padding: 10px; background-color: #f9f9f9; border-left: 4px solid #4CAF50; border-radius: 4px;">
          <div style="font-weight: bold; color: #555555;">AI Service:</div>
          <div style="color: #333333; margin-top: 5px;">${aiService}</div>
        </div>
    
        <div style="margin-bottom: 15px; padding: 10px; background-color: #f9f9f9; border-left: 4px solid #4CAF50; border-radius: 4px;">
          <div style="font-weight: bold; color: #555555;">Additional Info:</div>
          <div style="color: #333333; margin-top: 5px;">${additional ? additional : "NA"
        }</div>
        </div>
      </div>
    </div>`,
    };

    auth.sendMail(receiver, (err, emailResponse) => {
      if (err) {
        return res.json({
          success: false,
          message: "There was an error while saving the data",
        });
      } else {
        return res.json({
          success: true,
          message: "Form saved successfully",
        });
      }
    });
  } catch (err) {
    console.log("Error in aiformmail", err);
    return res.json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

app.post("/api/v1/sendcareer", upload.single("file"), (req, res) => {
  try {
    const { name, email, position } = req.body;
    const resume = req.file;

    if (!name || !position || !email || !resume) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required  details",
      });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter valid email",
      });
    }

    const auth = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "gmail",
      secure: true,
      port: 587,
      auth: {
        user: process.env.GMAIL_ACCOUNT,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const subject = "Job Application";

    const receiver = {
      from: process.env.GMAIL_ACCOUNT,
      to: process.env.TO,
      cc: [process.env.CC1, process.env.CC2, process.env.CC3, process.env.CC4, process.env.CC5],
      subject: subject,
      html: `<div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; margin: 0;">
      <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); max-width: 500px; margin: auto;">
        <h2 style="color: #333333; text-align: center;">Contact Details</h2>
    
        <div style="margin-bottom: 15px; padding: 10px; background-color: #f9f9f9; border-left: 4px solid #4CAF50; border-radius: 4px;">
          <div style="font-weight: bold; color: #555555;">Name:</div>
          <div style="color: #333333; margin-top: 5px;">${name}</div>
        </div>
    
        <div style="margin-bottom: 15px; padding: 10px; background-color: #f9f9f9; border-left: 4px solid #4CAF50; border-radius: 4px;">
          <div style="font-weight: bold; color: #555555;">Email:</div>
          <div style="color: #333333; margin-top: 5px;">${email}</div>
        </div>
    
        <div style="margin-bottom: 15px; padding: 10px; background-color: #f9f9f9; border-left: 4px solid #4CAF50; border-radius: 4px;">
          <div style="font-weight: bold; color: #555555;">Applied For:</div>
          <div style="color: #333333; margin-top: 5px;">${position}</div>
        </div>
      </div>
    </div>`,
      attachments: [
        {
          filename: resume.originalname,
          content: resume.buffer, // <-- use buffer instead of path
          contentType: resume.mimetype, // Path to the uploaded file
        },
      ],
    };

    auth.sendMail(receiver, (err, emailResponse) => {

      if (err) {
        return res.json({
          success: false,
          message: "There was an error while saving the data",
        });
      } else {
        return res.json({
          success: true,
          message: "Form saved successfully",
        });
      }
    });
  } catch (err) {
    console.log("Error in carrerformmail", err);
    return res.json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

app.post("/api/v1/commonform", (req, res) => {
  try {
    const { name, email, phone, budget, industry, country, type } = req.body;

    if (!name || !phone || !email || !budget || !industry) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required  details",
      });
    }

    if (budget <= 0) {
      return res.status(400).json({
        success: false,
        message: "Budget can't be 0 or negative",
      });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter valid email",
      });
    }

    const auth = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "gmail",
      secure: true,
      port: 587,
      auth: {
        user: process.env.GMAIL_ACCOUNT,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const subject = "New Lead from Digirocket Website";

    const receiver = {
      from: process.env.GMAIL_ACCOUNT,
      to: process.env.TO,
      cc: [process.env.CC1, process.env.CC2, process.env.CC3, process.env.CC4, process.env.CC5],
      subject: subject,
      html: `<div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; margin: 0;">
      <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); max-width: 500px; margin: auto;">
        <h2 style="color: #333333; text-align: center;">Contact Details</h2>
    
        <div style="margin-bottom: 15px; padding: 10px; background-color: #f9f9f9; border-left: 4px solid #4CAF50; border-radius: 4px;">
          <div style="font-weight: bold; color: #555555;">Name:</div>
          <div style="color: #333333; margin-top: 5px;">${name}</div>
        </div>
    
        <div style="margin-bottom: 15px; padding: 10px; background-color: #f9f9f9; border-left: 4px solid #4CAF50; border-radius: 4px;">
          <div style="font-weight: bold; color: #555555;">Email:</div>
          <div style="color: #333333; margin-top: 5px;">${email}</div>
        </div>
    
        <div style="margin-bottom: 15px; padding: 10px; background-color: #f9f9f9; border-left: 4px solid #4CAF50; border-radius: 4px;">
          <div style="font-weight: bold; color: #555555;">Phone:</div>
          <div style="color: #333333; margin-top: 5px;">${phone}</div>
        </div>

        <div style="margin-bottom: 15px; padding: 10px; background-color: #f9f9f9; border-left: 4px solid #4CAF50; border-radius: 4px;">
          <div style="font-weight: bold; color: #555555;">Country:</div>
          <div style="color: #333333; margin-top: 5px;">${country}</div>
        </div>

         <div style="margin-bottom: 15px; padding: 10px; background-color: #f9f9f9; border-left: 4px solid #4CAF50; border-radius: 4px;">
          <div style="font-weight: bold; color: #555555;">Development Service Type:</div>
          <div style="color: #333333; margin-top: 5px;">${type}</div>
        </div>

              <div style="margin-bottom: 15px; padding: 10px; background-color: #f9f9f9; border-left: 4px solid #4CAF50; border-radius: 4px;">
          <div style="font-weight: bold; color: #555555;">Budget:</div>
          <div style="color: #333333; margin-top: 5px;">$ ${budget}</div>
        </div>
      </div>
    </div>`,
    };

    auth.sendMail(receiver, (err, emailResponse) => {
      if (err) {
        return res.json({
          success: false,
          message: "There was an error while saving the data",
        });
      } else {
        return res.json({
          success: true,
          message: "Form saved successfully",
        });
      }
    });
  } catch (err) {
    console.log("Error in commonformmail", err);
    return res.json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

// export const login = async (req, res) => {
//   try {
//     const { password } = req.body;
//     if (password !== process.env.PASSWORD) {
//       return res.status(401).json({ success: false, message: "Invalid credentials" });
//     }

//     const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET_KEY, {
//       expiresIn: "7h",
//     });

//     res.cookie("auth_tokens", token, {
//       httpOnly: true,
//       secure: true, 
//       sameSite: "None",
//       maxAge: 7 * 60 * 60 * 1000, 
//     });

//     return res.status(200).json({ success: true, message: "Login successful" });
//   } catch (err) {
//     console.log("Login error:", err);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };
// app.post("/api/v1/login", login);


// app.get("/checkauth", (req, res) => {
//   try {
//     const token = req.cookies.auth_tokens;
//     if (!token)
//       return res.status(401).json({ success: false, message: "No token provided" });

//     jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
//       if (err)
//         return res.status(401).json({ success: false, message: "Invalid or expired token" });

//       return res.status(200).json({ success: true, user: decoded });
//     });
//   } catch (err) {
//     console.log("Error in /checkauth:", err);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// });

const startServer = async () => {
  try {
    await connectDB(); 
    app.listen(PORT, () => {
      console.log(`✅ Server is running at port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1); 
  }
};

startServer();
