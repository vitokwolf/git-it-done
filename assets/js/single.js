var issueContainerEl = document.querySelector('#issues-container');
var limitWarningEl = document.querySelector('#limit-warning');
var repoNameEl = document.querySelector("#repo-name");

var getRepoName = function(){
    var queryString = document.location.search;
    var repoName = queryString.split('=')[1];
    if(repoName){
    getRepoIssues(repoName);
    repoNameEl.textContent = repoName;
    } else {
        document.location.replace('./index.html');
    }
}

var getRepoIssues = function (repo) {
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";
    fetch(apiUrl).then(function (response) {
        // request was succesfull
        if (response.ok) {
            response.json().then(function (data) {
                displayIssues(data);
                // check if api has paginated issues
                if (response.headers.get('Link')) {
                    displayWarning(repo);
                }
            });
        } else {
            document.location.replace('./index.html');
        }
    });
};

var displayIssues = function (issues) {
    if (issues.length === 0) {
        issueContainerEl.textContent = 'This repo has no open issues';
        return;
    }
    for (let i = 0; i < issues.length; i++) {
        // create a link element to take users to the issues on github
        var issueEl = document.createElement('a');
        issueEl.classList = 'list-item flex-row justify-space-between align-center';
        issueEl.setAttribute('href', issues[i].html_url);
        issueEl.setAttribute('target', 'blank');

        // create span to hold issue title
        var titleEl = document.createElement('span');
        titleEl.textContent = issues[i].title;

        // append to container
        issueEl.appendChild(titleEl);

        // create a type element
        var typeEl = document.createElement('span');

        // check if issue is an actual issue or a pull request
        if (issues[i].pull_request) {
            typeEl.textContent = '(Pull Request)';
        } else {
            typeEl.textContent = '(Issues)';
        };

        // append to container
        issueEl.appendChild(typeEl);

        // append to the main page
        issueContainerEl.appendChild(issueEl);
    }
};

var displayWarning = function(repo) {
    // add text to warning container
    limitWarningEl.textContent = 'To see more than 30 issues, visit ';
    var linkEl = document.createElement('a');
    linkEl.textContent = 'see more Issues on GitHub.com';
    linkEl.setAttribute('href', 'https://github.com/' + repo + '/issues');
    linkEl.setAttribute('target', 'blank');

    // append to warning container
    limitWarningEl.appendChild(linkEl);
}

getRepoName();