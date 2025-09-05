var createPreferences = function() {
  pageVariables.editMode = false;
  pageVariables.shiftLineData = getOpenShiftLines.invoke();
  console.debug('shiftLineData-->' + json:asJSON(pageVariables.shiftLineData.data));

  var originalData = pageVariables.shiftLineData.data;
  var filteredData = [];

  originalData.forEach (function(shiftLine) {
    console.debug('Schedule Tag --> ' + json:asJSON(shiftLine.scheduleTag));
    console.debug('Active Bid Window --> ' + json:asJSON(pageVariables.activeBidWindow));
    console.debug('Schedule Window ID --> ' + json:asJSON(shiftLine.scheduleWindow.id));

    var isInActiveWindow = shiftLine.scheduleWindow.id.contains(pageVariables.activeBidWindow);
    var isMatchingOrg = shiftLine.schedulingOrganization.id.contains(pageVariables.schedulingOrganizationHLSO);
    var isMatchingTag = !empty shiftLine.scheduleTag && shiftLine.scheduleTag.contains(pageVariables.scheduleTag);

    if (isInActiveWindow && isMatchingOrg && isMatchingTag) {

      // Optional: create a visual representation of slot boxes
      var slotVisual = '';
      for (var i = 0; i < shiftLine.slots; i++) {
        slotVisual += '🟩';
      }

        var newShiftRow = {
          'scheduleWindow': {
            'id': shiftLine.scheduleWindow,
            'descriptor': shiftLine.scheduleWindow.descriptor
          },
          'schedulingOrganization': {
            'id': shiftLine.schedulingOrganization,
            'descriptor': shiftLine.schedulingOrganization.descriptor
          },
          'scheduleCalendar': {
            'id': shiftLine.scheduleCalendar.id,
            'descriptor': shiftLine.scheduleCalendar.descriptor
          },
          'scheduleTag': shiftLine.scheduleTag,
          'slots': shiftLine.slots,
          'slotBoxes': slotVisual,
          'preference': null
        };

      filteredData.add(newShiftRow);


    }


  });

  pageVariables.prefLineData = { 'data': filteredData };
  console.debug('Filtered Shift lines --> ' + json:asJSON(filteredData));
};
