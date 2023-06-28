const fs = require('fs');
const pdf = require('pdf-creator-node');
const path = require('path');
const options = require('../helpers/options');
const data = require('../helpers/data');
const { clearScreenDown } = require('readline');

const homeview =(req, res, next) =>{
    res.render('home');
}
const generatePdf = async(req, res, next) => {
    const html = fs.readFileSync(path.join(__dirname, '../views/template.html'), 'utf-8');
    const filename = Math.random() + '_doc' + '.pdf';
    let array = [];

    data.forEach(d =>{
        const prod = {
            name:d.name,
            description:d.description,
            quantity:d.quantity,
            price:d.price,
            total: d.quantity * d.price,
        }
        array.push(prod);
    });
    let subtotal = 0;
    array.forEach( i =>{
        subtotal += i.total
    });
    const tax = (subtotal *20) / 100;
    const grandtotal = subtotal - tax;
    const obj = {
        prodlist:array,
        subtotal:subtotal,
        tax:tax,
        gtotal:grandtotal,
    };
    const document = {
        html:html,
        data:{
            products:obj
        },
        // path:'/docs/'+ filename
        path:'/docs/'+ filename
    }
    
    pdf.create(document, options)
    .then(res => {
        console.log(res, "pdf create done");
    }).catch(error =>{
        console.log(error);
    });

    const filepath = 'http://localhost:3000/docs/' + filename;
    
    console.log(filepath, "file path download" );

    res.render('download', {
        path: filepath
    });
}

module.exports = {
    homeview,
    generatePdf
}