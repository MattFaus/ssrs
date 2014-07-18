/** @jsx React.DOM */
/*
 * Interface for card editing
 */
var React = require('react');
var BackboneMixin = require('./backbonemixin.js');
var models = require('./models.js');


// props: submitCardData
// stats:  [a dict representing fields which have been changed]
var EditorForm = React.createClass({
    getInitialState: function() {
        return {};
    },
    handleChange: function(field, event) {
        var state = {};
        state[field] = event.target.value;
        this.setState(state);
    },
    handleSubmit: function() {
        this.props.submitCardData(this.state);
    },
    render: function() {
        return <form className="editorForm" onSubmit={this.handleSubmit}>
            <input type="textarea" defaultValue={this.props.cardModel.front} onChange={_.partial(this.handleChange, 'front')} /> <br />
            <input type="textarea" defaultValue={this.props.cardModel.back} onChange={_.partial(this.handleChange, 'back')} />
            <input type="submit" value="Save" />
        </form>;
    }
});


// props: params.cardKey
// state: cardModel
var Editor = React.createClass({
    render: function() {
        if (this.state.cardModel) {
            return <div>
                <EditorForm cardModel={this.state.cardModel} submitCardData={this.submitCardData} />
            </div>;

        }

        // If we don't have the data yet, display a temp message.
        return <div>
            Please wait while your card data is fetched for editing. <br/>
            {this.props.params.cardKey}
        </div>;
    },
    getInitialState: function() {
        return {cardModel: null};
    },
    componentDidMount: function(elem) {
        if (!this.state.cardModel) {
            this.fetchCardData();
        }
    },
    fetchCardData: function() {
        var self = this;
        $.get('/api/card/' + this.props.params.cardKey, function(cardData) {
            cardData = JSON.parse(cardData);
            self.setState({cardModel: cardData});
        });
    },
    submitCardData: function(data) {
        var self = this;
        $.ajax({
            url: '/api/card/' + this.props.params.cardKey,
            contentType: "application/json",
            type: 'PUT',
            data: JSON.stringify(data),
            success: function(response) {
                console.log("PUT was successful: " + response);
            },
            error: function(xhr, status, err) {
                console.error(self.props.url, status, err.toString());
            }
        });
    }
});

module.exports = Editor;
