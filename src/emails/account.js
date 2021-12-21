const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'tungbigbang98@gmail.com',
        subject: 'Welcome to our family',
        text: `Hello ${name}, welcome to the app. Thanks for choosing us, let us know how your opinions about the app.`
    })
}

sendFarewellEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'tungbigbang98@gmail.com',
        subject: 'We\'re sad to see you leave.',
        text: `Goodbye ${name}, is there anything we could do to keep you with us?`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendFarewellEmail
}