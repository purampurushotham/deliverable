/**
 * Created by purushotham on 22/3/17.
 */
var SuccessResponse = function(status, data, pagination, message ) {
    this.status = status;
    this.data = data;
    if(pagination) {
        this.pagination = {};
        console.log(pagination.total);
        console.log("******** in pagination");
        this.pagination.total = pagination.total;
    }
    this.messages = message;
};

module.exports = SuccessResponse;
