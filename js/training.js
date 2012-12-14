(function($){
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
	  this.showTrainingStatus();
      $(this.el).html('<td>'+this.model.get('type')+'</td><td> '+this.model.get('time')+'</td><td> '+this.model.get('date')+'</td><td><span class="delete" style="cursor:pointer; color:red;  font-family:sans-serif;"><img src="images/ic_cleanup.png"></span></td>' );
      return this;
    },

	showTrainingStatus: function() {
		$('#training-status').css("display", "block");
        $('#training-status').html('Você já fez ' + this.calculateHourAndMinute()  +' de exercicio');
	},

	calculateHourAndMinute: function() {
	  var time = this.model.get('time');
	  var hour = parseFloat(time.substr(0,2));
	  var min = parseFloat(time.substr(3,2));	
	  hours += hour + min/60;
	  var decimal = hours - parseInt(hours);
	  var minutesConverted = Math.round(decimal * 60);
	  return parseInt(hours) + ' horas e ' + minutesConverted + ' minutos';
	},

    unrender: function(){
      $(this.el).remove();
    },

    remove: function(){
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
      $(this.el).append("<ul></ul>");
      _(this.collection.models).each(function(trainingItem){
        self.appendItem(trainingItem);
      }, this);
    },
	addItem: function(){
		var time = $("#time").val();
		var date = $("#date").val()		
		var type = $("#type option:selected").text();
						
		if (this.hasError(time, date, type)) {
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
		$('#message-error').css("display", "none");
	},
	hasError: function(time, date, type) {
		if (time == "") {
			$('#message-error').css("display", "block");
			$('#message-error').html('<strong>Preencha o tempo!</strong>');
			return true;
		} else if (date == "") {
			$('#message-error').css("display", "block");
			$('#message-error').html('<strong>Preencha a data!</strong>');
			return true;			
		} else {
			return false;
		}

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

