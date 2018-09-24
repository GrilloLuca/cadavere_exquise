var moment = require('moment');

var generateMessage = (from, text) => {
    return {
        from,
        text,
        createdAt: moment().format('LTS')
    };
};

module.exports = {generateMessage}