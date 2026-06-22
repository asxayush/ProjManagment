import Mailgen from "mailgen";



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
    forgotPasswordMailgenContent
}