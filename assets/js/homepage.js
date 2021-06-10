var languageButtonEl = document.querySelector('#language-buttons');

var getUserRepos = function (user) {
    // format the github api url
    var apiUrl = 'https://api.github.com/users/' + user + '/repos';

    // make a request to the url
    fetch(apiUrl)
        .then(function (response) {
            // request was successful
            if (response.ok) {
                response.json().then(function (data) {
                    displayRepos(data, user);
                });
            } else {
                alert('Error: GitHub User Not Found');
            }
        }).catch(function () {
            // Notice this catch getting chained onto the end of then method
            alert('Unable to connect to GitHub');
        })
};

var userformEl = document.querySelector('#user-form');
var nameInputEl = document.querySelector('#username');

var formSubmitHandler = function (event) {
    event.preventDefault();
    // get value from input element
    var username = nameInputEl.value.trim();

    if (username) {
        getUserRepos(username);
        nameInputEl.value = '';
    } else {
        alert('Please enter a github username');
    }
};

userformEl.addEventListener('submit', formSubmitHandler);

var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");

var displayRepos = function (repos, searchTerm) {
    // clear old content
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;

    // check if api returns any repos
    if (repos.length === 0) {
        repoContainerEl.textContent = 'No repositories found.';
        return;
    };

    // loop over repos
    for (let i = 0; i < repos.length; i++) {
        // format repo name
        var repoName = repos[i].owner.login + '/' + repos[i].name;


        // create container for each repo
        var repoEl = document.createElement('a');
        repoEl.setAttribute('href', './single-repo.html?repo=' + repoName);
        repoEl.classList = 'list-item flex-row justify-space-between align-center';

        // create a span element to hold repository name
        var titleEl = document.createElement('span');
        titleEl.textContent = repoName;

        // append to container
        repoEl.appendChild(titleEl);

        // create a status element
        var statusEl = document.createElement('span');
        statusEl.classList = 'flex-row align-center';

        // check if current repo has issues or not
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML = '<i class="fas fa-times status-icon icon-danger"></i>' + repos[i].open_issues_count + ' issue(s)';
        } else {
            statusEl.innerHTML = '<i class= "fas fa-check-square status_icon icon-succes"></i>';
        };

        // append to container
        repoEl.appendChild(statusEl);

        // append container to the DOM
        repoContainerEl.appendChild(repoEl);
    };
    console.log(repos);
    console.log(searchTerm);
};

var getFeaturedRepos = function (language) {
    var apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";

    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                displayRepos(data.items, language)
                console.log(data);
            });
        } else {
            alert('error:github user not found');
        }
    });
};

var buttonClickHandler = function (event) {
    var language = event.target.getAttribute('data-language');
    if (language) {
        getFeaturedRepos(language);
        repoContainerEl.textContent = '';
    }
}

languageButtonEl.addEventListener("click", buttonClickHandler);