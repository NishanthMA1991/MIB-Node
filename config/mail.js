var  nodemailer  =  require('nodemailer');

var  transporter  =  nodemailer.createTransport({
    service:  'gmail',
    auth: {
        user:  'men.in.blue.team.manager@gmail.com',
        pass:  'admin@MiB'
    }
});
var  mailOptions  =  {
    from:  'men.in.blue.team.manager@gmail.com',
    to:  '',
    subject:  '',
    text:  '',
    html:''
};

module.exports  = {
    transporter : transporter,
    mailOptions : mailOptions
} 