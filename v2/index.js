$(function() {

  // Define the widget collection.
  var collection = null;

  // Documentation: https://docs.morphii.com/widget_documentation_2_0.html
  // Define the morphii ids that will be used in the widgets.
  // Publicly available: https://docs.morphii.com/morphii_list.html
  var morphiiIds = [
    { id: '6362674737212084224' },
    { id: '6362666072115564544' },
    { id: '6363488681244622848' },
    { id: '6363734358316589056' },
    { id: '6363735117617217536' },
    { id: '6363735353273270272' },
    { id: '6202184384594837504', name: { en: 'Meh' } },
    { id: '6202184379079327744' },
    { id: '6206533129830662144',
      static_feedback: {
        show: true,
        label: {
          en: 'Please type your answer below:',
          es: 'Por favor escriba su respuesta a continuación:',
          zh: '请在下面输入您的答案'
        }
      }
    }
  ];

  // Setup the widget when the page is ready.
  $(document).ready(function() {
    createWidget();

    // Add change event to language selection.
    $('#language-selection').on('change', function(event) {
      if (collection) {
        var lang = document.getElementById('language-selection').value;
        collection.language(lang);
      }
    });

    // Call submit function when Submitt button is clicked.
    $('#submit-button').on('click', submit);

    // Disable submit button util a morphii is selected.
    $('#submit-button').prop('disabled', true);
  });

  // Define the widget options.
  function widgetOptions(divId, question) {
    return {
      div_id: divId,
      morphii: {
        ids: morphiiIds,
        show_name: true,  // Set to `false` to not display morphii names.
        wrap_name: true
      },
      target : {
        id: 'target-' + divId,
        type : 'question'
      },
      comment: {
        show: false,   // Set to `true` to see comment field.
        required: false
      },
      slider: {
        initial_intensity: 0.2,
        show_animation: true
      },
      selection: {
        required: true  // Set to `false` to not require selection.
      },
      options: {
        stage: 'test'
      }
    };
  }

  function createWidget() {
    var collectionOptions = {
      client_key: '47941407-64f1-4ca2-a895-1aeb136ac04d',
      account_id: '15553530',
      project: {
        id: 'widget-sample',
        description: 'Sample widget code.'
      },
      application: {
        name: 'sample-application',
        description: 'Sample demo of Widget v2.',
        version: '1.0'
      },
      user: {
        id: 'user-id'
      },
      callbacks: {
        error: errorCallback,
        selection_change: selectionChangeCallback
      }
    };

    collection = new MorphiiWidgets.Collection();
    collection.init(collectionOptions, function(error, valid) {
      if (valid === true) {
        // Add the first widget to the collection.
        var option = widgetOptions('widget-1', 'How did you feel before your visit?');
        collection.add(option, function(error, results) {
          if (error) {
            console.log('Collection add error: ' + JSON.stringify(error, null, 2));
          }
          else {
            // Add a second widget.
            option = widgetOptions('widget-2', 'How did you feel after your visit?');
            collection.add(option, function(error, results) {
              if (error) {
                console.log('Collection add error: ' + JSON.stringify(error, null, 2));
              }
              else {
                // Add additional metadata to each widget.
                collection.addMetadata('widget-1', 'question', 'How did you feel before your visit?');
                collection.addMetadata('widget-2', 'question', 'How did you feel after your visit?');
              }
            });
          }
        });
      }
      else {
        console.log('Init error: ' + JSON.stringify(error, null, 2));
      }
    });
  }


  // The Collection widget error callback
  function errorCallback(error) {
    console.log('Error callback: ' + JSON.stringify(error, null, 2));
  }

  // Selection Change callback
  function selectionChangeCallback(event) {
    console.log('Selection Change callback: ' + JSON.stringify(event, null, 2));
    // Enable/disable the Submit button based on if a morphii is selected.
    // If you do not want this behavior then set the selection->required to
    // false in the widget options above.
    // If selection required is set to false then this callback is not needed.
    if (event.selection_required_valid === true) {
      $('#submit-button').prop('disabled', false);
    }
    else {
      $('#submit-button').prop('disabled', true);
    }
  }

  // Submit the data for the collection.
  function submit(event) {
    if (collection) {
      // Submit all the widget in the collection at once.
      collection.submit(function(error, results) {
        if (error) {
          console.log('Submit results (error): ' + JSON.stringify(error, null, 2));
        }
        else {
          // To view the results, iterator over each record.
          var length = results.length;
          for (var i = 0; i < length; i++) {
            var record = results[i];
            if (record && record.submitted === true) {
              console.log('Submit record: ' + JSON.stringify(record, null, 2));

              // You have access to all the data submitted at this point. For example,
              // you may want the morphii Id, name, intensity, and comment to store
              // in your database.
              // You can pull other information from the results if you like (i.e. referer, user agent, etc...)
              console.log('Results for target id: ' + record.target_id);
              console.log('reaction id: ' + record.reaction_id);
              if (record.reaction_record) {
                console.log('Question: ' + record.reaction_record.target.metadata.question);
                console.log('morphii id: ' + record.reaction_record.morphii.id);
                console.log('morphii display name: ' + record.reaction_record.morphii.display_name);
                console.log('morphii intensity: ' + record.reaction_record.morphii.intensity);
                if (record.reaction_record.comment) {
                  console.log('comment locale: ' + record.reaction_record.comment.locale);
                  console.log('comment text: ' + record.reaction_record.comment.text);
                }
                else {
                  console.log('No comment provided');
                }
              }
              else {
                console.log('Subscription for this account has expired or reached the reaction limit.');
              }
            }
            else {
              console.log('Morphii data not submitted.');
              console.log('Submit results: ' + JSON.stringify(record, null, 2));
            }
          }
        }
      });
    }
  }
});
