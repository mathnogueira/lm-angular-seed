// jshint-ignore
@service('app.core', 'UploadService')
@inject('$http')
// end-ignore
class UploadService {

    constructor($http) {
        this.$http = $http;
        this.config = UploadService.getConfig();
    }

    static getConfig() {
        return {
            uploadUrl: 'Documents/Upload',
            removeUrl: 'Documents/Remove',
        };
    }

    uploadFile(file) {
        return this.$http.post(this.config.uploadUrl, file);
    }

    removeFile(fileUrl) {
        let container = {
            url: fileUrl
        };
        return this.$http.post(this.config.removeUrl, container);
    }
}