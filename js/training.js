(function training($){
  var hours = 0;
  Backbone.sync = function(method, model, success, error){ 
    success();
  }
  
  var TrainingItem = Backbone.Model.extend({
    defaults: {
      type: null,
      time: null,
	  date: null
    }
  });
  
  var List = Backbone.Collection.extend({
    model: TrainingItem
  });

  var ItemView = Backbone.View.extend({
    tagName: 'tr',
    events: { 
      'click span.delete': 'remove'
    },    

    initialize: function(){
      _.bindAll(this, 'render', 'unrender', 'remove'); 

      this.model.bind('remove', this.unrender);
    },

    render: function(){
	  this.showTrainingStatus(true);
	  this.addTrainingLine();
      return this;
    },

	addTrainingLine: function() {
	  $(this.el).html('<td>'+this.model.get('type')+'</td><td> '+this.model.get('time')+'</td><td> '+this.model.get('date')+'</td><td><span class="delete" style="cursor:pointer; font-family:sans-serif;"><img src="images/ic_cleanup.png"></span></td>' );	
	},

	showTrainingStatus: function(isSum) {
		$('#training-status').css("display", "block");
        $('#training-status').html('Você já fez ' + this.calculateHourAndMinute(isSum)  +' de exercicio(s)');
	},

	calculateHourAndMinute: function(isSum) {
	  var time = this.model.get('time');
	  var hour = parseFloat(time.substr(0,2));
	  var min = parseFloat(time.substr(3,2));	
	  if (isSum) {
		 hours += hour + min/60;
	 } else {
	     hours -= hour + min/60;	
 	 }
	  var decimal = hours - parseInt(hours);
	  var minutesConverted = Math.round(decimal * 60);
	  if (minutesConverted % 60 == 0) {
		hours = parseInt(hours) + minutesConverted / 60;
		minutesConverted = 0;
	  }		
	  return parseInt(hours) + ' horas e ' + minutesConverted + ' minutos';
	},

    unrender: function(){
      $(this.el).remove();
    },

    remove: function(){
	  this.showTrainingStatus(false);
      this.model.destroy();
    }
  });
  
  var ListView = Backbone.View.extend({
    el: $('body'),
    events: {
      'click button#add': 'addItem'
   },

    initialize: function(){
      _.bindAll(this, 'render', 'addItem', 'appendItem');
      
      this.collection = new List();
      this.collection.bind('add', this.appendItem);

      this.render();
    },

    render: function(){
      var self = this;
      _(this.collection.models).each(function(trainingItem){
        self.appendItem(trainingItem);
      }, this);
    },

	addItem: function(){
		var time = $("#time").val();
		var date = $("#date").val()		
		var type = $("#type option:selected").text();
						
		if (!isValidFields(time, date, type)) {
			return;
		}
		
		var trainingItem = new TrainingItem();
        trainingItem.set({
          type: type,
  		  time: time,
		  date: date
        });		
        this.collection.add(trainingItem);
		
		this.clearFields();
    },

	clearFields: function() {
		$("#time").val('');
		$("#date").val('');
		$("#type option:first").attr('selected','selected');
		//$('#message-error').css("display", "none");
	},
	
    appendItem: function(trainingItem){
      var itemView = new ItemView({
        model: trainingItem
      });
      $('table', this.el).append(itemView.render().el);
    }
  });

  var listView = new ListView();
})(jQuery);

