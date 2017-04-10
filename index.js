$(function() {

  // Define the widget collection.
  var collection = null;

  // Define the morphii ids that will be used in the widgets. We can provide you
  // with a list of all the publicly available morphii ids.
  var morphiiIds = [
    {
      id: '6202173597771890688',
      name: 'Frustrated'
    },
    {
      id: '6202173599617384448',
      name: 'Disappointed'
    },
    {
      id: '6202184384594837504',
      name: 'Meh'
    },
    {
      id: '6202173599499943936',
      name: 'Disgusted'
    },
    {
      id: '6202173597872553984',
      name: 'Delighted'
    }
  ];

  // Setup the widget when the page is ready.
  $(document).ready(function() {
    createWidget();

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
        show_name: true  // Set to `false` to not display morphii names.
      },
      target : {
        id: 'target-' + divId,
        type : 'question',
        metadata: {
          question: question
        }
      },
      comment: {
        show: false,   // Set to `true` to see comment field.
        required: false,
        label: 'Leave a comment:'
      },
      slider: {
        initial_intensity: 0.2,
      },
      submit_button: {
        show: false
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
      user: {
        anonymous: true
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
