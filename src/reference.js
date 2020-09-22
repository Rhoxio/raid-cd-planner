    var numberOfGroups = 1;
    var groups = new vis.DataSet()
    for (var i = 0; i < numberOfGroups; i++) {
        groups.add({
            id: i,
            content: 'Truck&nbsp;' + i
        })
    }

    // create items
    var numberOfItems = 10;
    var items = new vis.DataSet();

    var itemsPerGroup = Math.round(numberOfItems / numberOfGroups);

    for (var truck = 0; truck < numberOfGroups; truck++) {
        var date = new Date();
        for (var order = 0; order < itemsPerGroup; order++) {
            date.setHours(date.getHours() + 4 * (Math.random() < 0.2));
            var start = new Date(date);

            date.setHours(date.getHours() + 2 + Math.floor(Math.random() * 4));
            var end = new Date(date);

            items.add({
                id: order + itemsPerGroup * truck,
                group: truck,
                start: start,
                end: end,
                content: 'Order ' + order
            });
        }
    }

    // specify options
    var options = {
        stack: true,
        start: new Date(),
        end: new Date(1000 * 60 * 60 * 24 + (new Date()).valueOf()),
        editable: true,
        orientation: 'top',
        onDropObjectOnItem: function(objectData, item, callback) {
            if (!item) { return; }
            alert('dropped object with content: "' + objectData.content + '" to item: "' + item.content + '"');
        }
    };

    // create a Timeline
    var container = document.getElementById('mytimeline');
    timeline1 = new vis.Timeline(container, items, groups, options);

    function handleDragStart(event) {
        var dragSrcEl = event.target;

        event.dataTransfer.effectAllowed = 'move';
        var itemType = event.target.innerHTML.split('-')[1].trim();
        var item = {
            id: new Date(),
            type: itemType,
            content: event.target.innerHTML.split('-')[0].trim()
        };
        // set event.target ID with item ID
        event.target.id = new Date(item.id).toISOString();

        var isFixedTimes = (event.target.innerHTML.split('-')[2] && event.target.innerHTML.split('-')[2].trim() == 'fixed times')
        if (isFixedTimes) {
            item.start = new Date();
            item.end = new Date(1000 * 60 * 10 + (new Date()).valueOf());
        }
        event.dataTransfer.setData("text", JSON.stringify(item));

        // Trigger on from the new item dragged when this item drag is finish
        event.target.addEventListener('dragend', handleDragEnd.bind(this), false);
    }

    function handleDragEnd(event) {
        // Last item that just been dragged, its ID is the same of event.target
        var newItem_dropped = timeline1.itemsData.get(event.target.id);

        var html = "<b>id: </b>" + newItem_dropped.id + "<br>";
        html += "<b>content: </b>" + newItem_dropped.content + "<br>";
        html += "<b>start: </b>" + newItem_dropped.start + "<br>";
        html += "<b>end: </b>" + newItem_dropped.end + "<br>";
        document.getElementById('output').innerHTML = html;
    }

    function handleObjectItemDragStart(event) {
        var dragSrcEl = event.target;

        event.dataTransfer.effectAllowed = 'move';
        var objectItem = {
            content: 'objectItemData',
            target: 'item'
        };
        event.dataTransfer.setData("text", JSON.stringify(objectItem));
    }

    var items = document.querySelectorAll('.items .item');

    var objectItems = document.querySelectorAll('.object-item');

    for (var i = items.length - 1; i >= 0; i--) {
        var item = items[i];
        item.addEventListener('dragstart', handleDragStart.bind(this), false);
    }

    for (var i = objectItems.length - 1; i >= 0; i--) {
        var objectItem = objectItems[i];
        objectItem.addEventListener('dragstart', handleObjectItemDragStart.bind(this), false);
    }