import Mailgen from "mailgen";
import nodemailer from "nodemailer"


const sendEmail = async (options) => {
    const mailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: "Task Manager",
            link: "http://taskmanage.com"
        }
    })


   const emailTextual =  mailGenerator.generatePlaintext(options.mailgenContent)

   const emailHtml =  mailGenerator.generate(options.mailgenContent)

   const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_SMTP_HOST,
    port: process.env.MAILTRAP_SMTP_PORT,
    auth: {
        user: process.env.MAILTRAP_SMTP_USER,
        password: process.env.MAILTRAP_SMTP_PASS
    }
   })


   const mail = {
        from: "mail.taskmanager@example.com",
        to: options.email,
        subject: options.subject,
        text: emailTextual,
        html: emailHtml
   }

   try {
    await transporter.sendMail(mail)
   } catch (error) {
        console.error("Email service failed silenty, make sure you have provided your MAILTRAP Credential in .env file")

        console.error("Error: ", error)
   }

}


const emailVerificationMailgenContent = (username, verificationUrl) => {
    return {
        body: {
            name: username,
            intro: "Welcome to our App!",
            action: {
                instructions: "To verify your email please click on the following button",
                button: {
                    color: "#22BC66",
                    text: "Verify your email",
                    link: verificationUrl
                },
            },
            outro: "Need help, OR HAVE QUESTION? Just reply to email"
        },
    }
}

const forgotPasswordMailgenContent = (username, passwordResetUrl) => {
    return {
        body: {
            name: username,
            intro: "we got a request to reset your password of your account",
            action: {
                instructions: "To reset your email please click on the following button",
                button: {
                    color: "#223ebc",
                    text: "Reset Password",
                    link: passwordResetUrl
                },
            },
            outro: "Need help, OR HAVE QUESTION? Just reply to email"
        },
    }
}


export{
    emailVerificationMailgenContent,
    forgotPasswordMailgenContent,
    sendEmail
}