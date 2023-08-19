
const axios = require("axios");

module.exports.CallEventBus =  async (event_type, data, token) => {

    let header = {
        headers: {
            'Authorization': token 
        }
    }
    let bodyData = data

    bodyData['event_type'] = event_type;

    return await axios.post(process.env.EVENT_BUS_URL+"/adminEvents",bodyData,header).then((responsedata) => {
        return responsedata?.data || null
    }).catch((err) => {
        console.log("error occured in admin event bus", err.message);
        return false
    });
}

module.exports.CallAdminEvent =  async (event_type, data, token) => {
    
    let header = {
        headers: {
            'Authorization': token 
        }
    }

    let bodyData = data;
    bodyData['event_type'] = event_type;

    return await axios.post(process.env.EVENT_BUS_URL+"/adminEvents",bodyData,header).then((responsedata) => {
        return responsedata?.data?.data || null
    }).catch((err) => {
        console.log("error occured in admin event bus", err.message);
        return false
    });
}

module.exports.CallCourseQueryEvent =  async (event_type, data, token) => {
    
    let header = {
        headers: {
            'Authorization': token 
        }
    }

    let bodyData = data;
    bodyData['event_type'] = event_type;

    return await axios.post(process.env.EVENT_BUS_URL+"/courseQueryEvent",bodyData,header).then((responsedata) => {
        return responsedata?.data?.data || null
    }).catch((err) => {
        console.log("error occured in admin event bus", err.message);
        return false
    });
}

module.exports.CallCourseQueryDataEvent =  async (event_type, data, token) => {
    
    let header = {
        headers: {
            'Authorization': token 
        }
    }

    let bodyData = data;
    bodyData['event_type'] = event_type;

    return await axios.post(process.env.EVENT_BUS_URL+"/courseQueryEvent",bodyData,header).then((responsedata) => {
        return responsedata?.data?.data || null
    }).catch((err) => {
        console.log("error occured in admin event bus", err.message);
        return false
    });
}

module.exports.CallUserEvent =  async (event_type, data, token) => {
    
    let header = {
        headers: {
            'Authorization': token 
        }
    }

    let bodyData = data;
    bodyData['event_type'] = event_type;

    return await axios.post(process.env.EVENT_BUS_URL+"/userEvent",bodyData,header).then((responsedata) => {
        return responsedata?.data?.data || null
    }).catch((err) => {
        console.log("error occured in admin event bus", err.message);
        return false
    });
}

module.exports.CallCourseEvents =  async (event_type, data, token) => {
    
    let header = {
        headers: {
            'Authorization': token 
        }
    }

    let bodyData = data;
    bodyData['event_type'] = event_type;

    return await axios.post(process.env.EVENT_BUS_URL+"/courseEvents",bodyData,header).then((responsedata) => {
        return responsedata?.data?.data || null
    }).catch((err) => {
        console.log("error occured in admin event bus", err.message);
        return false
    });
}


  
