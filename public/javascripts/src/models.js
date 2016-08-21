santa = {
    collections: {},
    models: {},
    views: {},
    constructors: {},
    ich: {}
};

santa.constructors.Santa = Backbone.Model.extend({

    addSanta: function(santaInfo){
        var self = this, deferred = new $.Deferred();
        $.ajax({
            type: 'post',
            url: 'addSanta',
            data: santaInfo,
            success: function(response){
                deferred.resolve();
            }
        });
        return deferred.promise();
    },

    getIsMixed: function(){
        var self = this, deferred = new $.Deferred();
        $.ajax({
            type: 'post',
            url: 'getIsMixed',
            success: function(response){
                self.set('isMixed', response.isMixed);
                deferred.resolve();
            }
        });
        return deferred.promise();
    },

    getSanta: function(santaInfo){
        var self = this, deferred = new $.Deferred();

        $.ajax({
            type: 'post',
            url:'getSanta',
            data: santaInfo,
            success: function(response){
                deferred.resolve(response);
            }
        });
        return deferred.promise();
    }
});

santa.constructors.Templates = Backbone.Collection.extend({
    getTemplates: function(){

        var self = this, deferred = new $.Deferred();

        $.ajax({
            'type': 'get',
            'url': 'templates.html',
            'success': function(resp){
                _.each($(resp).siblings('script'), function(scr){
                    ich.addTemplate(scr.id, $(scr).html());
                });
                deferred.resolve();
            }
        });

        return deferred.promise();

    }

});
