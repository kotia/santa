santa.constructors.ContainerView = Backbone.View.extend({
    initialize: function(){
        this.template = ich.container;
        this.el = this.template({})[0];
        this.render();
    },

    render: function(){

        $('body').html(this.el);
        if(santa.models.santa.get('isMixed')){
            santa.views.getView = new santa.constructors.GetView();
        } else {
            santa.views.fillView = new santa.constructors.FillView();
        }
    }
});

santa.constructors.FillView = Backbone.View.extend({
    tagName: 'div',
    className: 'addSanta',
    events: {
        "click .sendData": 'sendData'
    },
    initialize: function(){
        this.template = ich.addSanta;
        this.$el.html(this.template({})[0]);
        this.render();
    },

    render: function(){
        $('.container').html(this.el);
        this.delegateEvents();
    },

    sendData: function(){
        var self = this,
            element = this.$el,
            name = $.trim(element.find('input[name=name]').val()),
            email = $.trim(element.find('input[name=email]').val()),
            password = $.trim(element.find('input[name=password]').val());
        if(!name || !email || !password){
            element.find('.error').show();
        } else {
            $.when(santa.models.santa.addSanta({name: name, email: email, password: password})).done(function(){
                element.find('input').val('');
                element.html(ich.adderGreeting({}));
            });

        }
    }
});

santa.constructors.GetView = Backbone.View.extend({
    tagName: 'div',
    className: 'getSanta',
    events: {
        'click .viewData': 'viewData'
    },
    initialize: function(){
        this.template = ich.getSanta;
        this.$el.html(this.template({})[0]);
        this.render();
    },

    render: function(){
        $('.container').html(this.el);
        this.delegateEvents();
    },

    viewData: function(){
        var self = this,
            element = this.$el,
            email = $.trim(element.find('input[name=email]').val()),
            password = $.trim(element.find('input[name=password]').val());
        if(!email || !password){
            element.find('.error.emptyFields').show();
        } else {
            $.when(santa.models.santa.getSanta({email: email, password: password})).done(function(resp){
                if(!resp.status){
                    element.find('.error.wrong').show();
                } else {
                    element.find('input').val('');
                    element.html(ich.toInfo({santaName: resp.data.santaName, name: resp.data.toName}));
                }
            });

        }
    }
});







