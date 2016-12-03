var admin = {
    rooms: ko.observableArray([1,2,3])
}

document.addEventListener("DOMContentLoaded", function(event) {
    ko.applyBindings(admin);
});
