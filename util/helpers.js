const fs = require('fs');


/**
 * Returns an array of attachments 
 */ 
function composeAttachments(actions) {
    // Spit actions in to attachments.
    // Max 4 actions per attachment
    let attachmetsAmount = Math.ceil(actions.length / 4);
    const attachments = [];

    for(let i = 1; i <= attachmetsAmount; i++) {
        const title = i === 1 ? 'Make your choice from list above.' : '';
        const start = (i - 1) * 4;
        const end = start + 4;

        attachments.push({
            title: title,
            callback_id: 'selectMenuItem',
            attachment_type: 'default',
            color: '#ffc20f',
            actions: actions.slice(start, end),
        });
    }

    return attachments;
}

/**
 * Toogle user for item
 * @param {*} item 
 * @param {*} user 
 */
function toggleUser(item, user) {
    let str = '';
    let users = [];
    const userSlackString= `<@${user}>`;
    const blockquote = '\n&gt;';
    const userRegEx = /<@[^>]+>/g; //Matches , <@USER> | <@USER>,
    const itemArr = item.split(blockquote);
    const usersString = itemArr[1];

    // save item title
    str = itemArr[0];
    
    if(usersString) {
        // Find all users in string
        users = usersString.match(userRegEx);

        // User is in list lets remove
        if(users.indexOf(userSlackString) > -1) {
            users = users.filter( user => user !== userSlackString);
        } else {
            users.push(userSlackString);
        }
    } else {
        users.push(`<@${user}>`);
    }

    if (users.length) {
        str += `${blockquote} ${users.join(', ')}`;
    }

    return  str.trim();
}

/**
 * Check if file exists
 * @param {*} path 
 */
function fileExists(path) {
    return new Promise((resolve) => {
        fs.access(path,  (err) => {
            if (err) {
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });
}

/**
 * Runs toJSON for each element of array
 * @param {*} arr 
 */
function arrayToJSON(arr) {
    let jsonArr = {};

    if(Array.isArray(arr)) {
        arr.forEach(element => {
            if(element.toJSON) {
                jsonArr[element.id] = element.toJSON();
            }
        });
    }

    return jsonArr;
}

/**
 * Converts onject to arrau
 * @param {Object} json 
 * @param {Function} decotator decorating function should always return
 */
function jsonToArray(json, decorator) {
    let arr = [];

    if(json) {
        for (const key in json) {
            if (json.hasOwnProperty(key)) {
                arr.push(decorator(json[key]));
            }
        }
    }

    return arr;
}

module.exports = {
    toggleUser: toggleUser,
    composeAttachments: composeAttachments,
    fileExists: fileExists,
    arrayToJSON: arrayToJSON,
    jsonToArray: jsonToArray
};