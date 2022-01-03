let people = ['geddy', 'neil', 'alex'],
    html = ejs.render('<%= people.join(", "); %>', {
        people: people
    });
document.getElementById('output').innerHTML = html;