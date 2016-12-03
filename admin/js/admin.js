function request(url, data, success) {
    $.ajax({
        url: url,
        dataType: 'json',
        type: 'post',
        async: true,
        data: data,
        success: function (data) { success(data); },
        error: function () {}
    });
}

var admin = {
    rooms: ko.observableArray([]),
    newRoomName: ko.observable('')
}

admin.loadAll = function () {
    request('/api/loadall', null, function (rooms) {
        console.log(rooms);
        admin.rooms(rooms);
    });
};

admin.newRoomCreate = function () {
    request('/api/newroom', {name: admin.newRoomName()}, function () {
        admin.rooms.push({
            name: admin.newRoomName()
        });
        admin.newRoomName('');
    });
};

admin.removeRoom = function (room, event) {
    request('/api/removeRoom', {name: room.name}, function () {
        admin.rooms().forEach(function (_room, index) {
            if (room === _room) {
                admin.rooms.splice(index, 1);
                return;
            }
        });
    });
};


document.addEventListener("DOMContentLoaded", function(event) {
    ko.applyBindings(admin);

    admin.loadAll();
});
