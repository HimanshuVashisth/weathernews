import './App.css';
import React, { Component } from 'react';
import Button from './buttons';
import { DEFAULT_QUERY, PATH_BASE, PATH_SEARCH, PARAM_SEARCH, PARAM_PAGE } from './constants';

const largeColumn = { width: '40%' };
const midColumn = { width: '30%' };
const smallColumn = { width: '10%' };

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            results: null,
            searchKey: '',
            searchValue: DEFAULT_QUERY,
            error: null,
        };

        this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
        this.setSearchTopStories = this.setSearchTopStories.bind(this);
        this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.onSearchSubmit = this.onSearchSubmit.bind(this);
        this.onDismiss = this.onDismiss.bind(this);

    }

    componentDidMount() {
        const { searchValue } = this.state;
        this.setState({ searchKey: searchValue });
        this.fetchSearchTopStories(searchValue);
    }

    fetchSearchTopStories(searchValue, page = 0) {
        fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchValue}&${PARAM_PAGE}${page}`)
            .then(response => response.json())
            .then(result => this.setSearchTopStories(result))
            .catch(e => this.setState({ error: e }));
    }

    setSearchTopStories(result) {
        const { hits, page } = result;
        const { searchKey, results } = this.state;

        const oldHits = results && results[searchKey] ? results[searchKey].hits : [];

        const updatedHits = [...oldHits, ...hits];

        this.setState({
            results: {
                ...results,
                [searchKey]: { hits: updatedHits, page }
            }
        })
    }

    onDismiss(id) {
        console.log('Inside onDismiss: ', JSON.stringify(id));
        const { searchKey, results } = this.state;
        const { hits, page } = results[searchKey];

        const isNotId = item => item.objectID !== id;
        const updatedHits = hits.filter(isNotId);
        this.setState({
            results: { ...results, [searchKey]: { hits: updatedHits, page } }
        });
    }

    onSearchChange(event) {
        this.setState({ searchValue: event.target.value });
    }

    onSearchSubmit(event) {
        const { searchValue } = this.state;
        this.setState({ searchKey: searchValue });

        if (this.needsToSearchTopStories(searchValue)) {
            this.fetchSearchTopStories(searchValue);
        }

        event.preventDefault();
    }

    needsToSearchTopStories(searchValue) {
        return !this.state.results[searchValue];
    }

    render() {

        const { searchValue, results, searchKey, error } = this.state;
        const page = (results && results[searchKey] && results[searchKey].page) || 0;
        const list = (results && results[searchKey] && results[searchKey].hits) || [];

        if (!results) { return null; }

        if (error) { return <p> Something went wrong. </p> }

        return (
            <div className="page" >
                <div className="interactions">
                    <Search value={searchValue} onChange={this.onSearchChange} onSubmit={this.onSearchSubmit}> Search </Search> <br />
                </div>

                { error ?
                    <div className="interactions">
                        <p>Something went wrong. </p>
                    </div>
                    : <Table list={list} onDismiss={this.onDismiss} />
                }

                { results &&
                    <Table list={list} onDismiss={this.onDismiss} />
                }

                <div className="interactions">
                    <Button onClick={() => this.fetchSearchTopStories(searchValue, page + 1)}> More </Button> <br />
                </div>
            </div>
        );
    }

}

export default App;

const Search = ({ value, onChange, onSubmit, children }) =>
    <form onSubmit={onSubmit}>
        <input type="text" value={value} onChange={onChange} />
        <button type="submit">
            {children}
        </button>
    </form>

const Table = ({ list, onDismiss }) =>
    <div className="table">
        {list.map(item =>
            <li>
                <div key={item.objectID} className="table-row">
                    <span style={{ largeColumn }}>
                        <a href={item.title}> {item.title}</a>
                    </span>
                    <span style={{ midColumn }}>{item.author}</span>
                    <span style={{ smallColumn }}>{item.num_comments}</span>
                    <span style={{ smallColumn }}>{item.points}</span>
                    <span style={{ smallColumn }}>
                        <Button onClick={() => onDismiss(item.objectID)} className="button-inline">
                            Dismiss
                        </Button>
                    </span>
                </div>
            </li>
        )}
    </div>


export {
    Button,
    Search,
    Table
}