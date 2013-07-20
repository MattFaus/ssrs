/** @jsx React.DOM */
// see it in action - http://jsfiddle.net/dinojoel/8LRge/15/

/*
 * Cards store the following data:
 * - front: markup appearing on the front of the card
 * - back: markup appearing on the back of the card
 * - tags: list of tag names
 * - ... meta ...
 */
var CardModel = Backbone.Model.extend({
    rate: function(rating) { console.log('rated ' + rating); }
});

var cards = [
    new CardModel({front: 'allez', back: 'go', tags: ['french']}),
    new CardModel({front: 'matin', back: 'morning', tags: ['french']})
];

var CardList = React.createClass({
    render: function() {
        var currentCard = this.state.cardNum;
        var cards = _(this.props.models).map(function(model, ix) {
            var scale = currentCard === ix ? 1 : 0.8;
            var style = {
                '-webkit-transform': 'scale(' + scale + ')',
                left: (50060 + (ix - currentCard) * 420) + 'px'
            };
            return <Card model={model}
                         style={style}
                         nextCard={this.nextCard} />;
        }, this);
        return <div class='cardlist'>{cards}</div>;
    },
    // TODO - does this have to be a function?
    getInitialState: function() {
        return { cardNum: 0 };
    },
    nextCard: React.autoBind(function() {
        this.setState({cardNum: this.state.cardNum + 1});
    })
});

// props: nextCard, front, back, (tags or meta)
var Card = React.createClass({
    render: function() {
        var stateView,
            rate = function(rating) {
                this.props.model.rate(rating);
                this.props.nextCard();
            }.bind(this);
        if (this.state.state === 'front') {
            var clickHandler = _(this.setState.bind(this))
                .partial({ state: 'back' });
            stateView = <CardFront
                content={this.props.model.get('front')}
                onClick={clickHandler} />
        } else if (this.state.state === 'back') {
            stateView = <CardBack
                content={this.props.model.get('back')}
                rate={rate} />;
        } else { // meta
            stateView = <CardMeta info={this.props.model.get('meta')} />;
        }
        return <div class='card' style={this.props.style}>
            {stateView}
        </div>;
    },
    getInitialState: function() {
        return {
            state: 'front'
        };
    }
});

var CardFront = React.createClass({
    render: function() {
        return <div class='cardFront' onClick={this.props.onClick}>
            <Content content={this.props.content} />
        </div>;
    }
});

var CardBack = React.createClass({
    render: function() {
        // <MetaButton onClick={undefined} />
        return <div class='clearfix'>
            <Content content={this.props.content} />
            <Choices rate={this.props.rate} />
        </div>;
    }
});

var CardMeta = React.createClass({
    render: function() {
        return <span />;
    }
});

var Content = React.createClass({
    render: function() {
        return <div class='content'>{this.props.content}</div>;
    }
});

var Choices = React.createClass({
    render: function() {
        return <div class='choices'>
            <span class='choices_hard'
                  onClick={_(this.props.rate).partial('hard')}>
                Hard
            </span>
            <span class='choices_easy'
                  onClick={_(this.props.rate).partial('easy')}>
                Easy
            </span>
        </div>;
    }
});

var MetaButton = React.createClass({
    render: function() {
        return <div />;
    }
});

React.renderComponent(<CardList models={cards} />, document.body);
