// jshint-ignore
@directive('app.core', 'fileUploader')
@inject(['$scope', 'UploadService'])
// end-ignore
class SimpleFileUploader {

    static config() {
        return {
            // Create a new scope for sharing the controller variable that
            // will hold the file after the upload.
            scope: {
                // The attribute files will be used as the sharing variable
                files: '=',
                maxFiles: '<',
                disabled: '<'
            },

            // This directive can only be used as an element. It doesnt make sense
            // to use it as an attribute because it doesnt decorate a new funcionality,
            // instead, it creates a new one from scratch. 
            restrict: 'E',

            // Template for the uploader
            templateUrl: 'app/core/directives/upload/upload.template.html',

            controllerAs: 'uploader',
        };
    }

    static link(scope, element, attr) {
        scope.maxFiles = scope.maxFiles || 1;
    }

    constructor($scope, UploadService) {
        this.uploader = UploadService;
        this.files = [];
        this.scope = $scope;
        this.numberFiles = 0;
    }

    onFilesChange(files) {
        if (files.length > 0) {
            this.addFiles(files);
        }
    }

    addFiles(files) {
        let i = 0;
        while (i < files.length) {
            if (this.numberFiles < this.scope.maxFiles) {
                this.files.push(files[i]);
                this.numberFiles++;
                this.uploader.uploadFile(files[i])
                    .then(
                        this.onUploadSuccess.bind(this),
                        this.onUploadFail.bind(this)
                    );

            } else {
                this.scope.$emit('UploadDirective.maxFilesExceeded');
            }
            i++;
        }
    }

    removeFile(file) {
        let index = this.files.indexOf(file);
        if (index >= 0) {
            this.uploader.removeFile(file.name)
                .then(() => {
                    this.files.splice(index, 1);
                    this.numberFiles--;
                }, this.onRemovalFail.bind(this));
        }
    }

    onUploadSuccess(response) {
        console.log('success');
    }

    onUploadFail(response) {
        console.log('error');
        this.numberFiles--;
    }
}