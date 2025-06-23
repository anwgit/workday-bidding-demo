// src/App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import BiddingDashboard             from './pages/BiddingDashboard';
import ShiftBoard                   from './pages/ShiftBoard';
import ManageBids                   from './pages/ManageBids';
import Employees                    from './pages/Employees';

// Shift Bidding pages
import ShiftIngestion               from './pages/ShiftIngestion';
import ShiftBidWindows              from './pages/ShiftBidWindows';
import ShiftBiddingDefineSchedules from './pages/ShiftBiddingDefineSchedules';
import ShiftBiddingMonitor          from './pages/ShiftBiddingMonitor';
import OpenShifts                   from './pages/OpenShifts';
import EmployeeShiftPreferences     from './pages/EmployeeShiftPreferences';
import ShiftBidding                 from './pages/ShiftBidding';
import ShiftAward                   from './pages/ShiftAward';

// Overtime Bidding pages
import StaffingLevels               from './pages/StaffingLevels';
import OvertimeShiftsView           from './pages/OvertimeShiftsView';
import RuleSetManager               from './pages/RuleSetManager';
import RuleSetsView                 from './pages/RuleSetsView';
import OtBiddingProcess             from './pages/OtBiddingProcess';

// Vacation Bidding pages
import EmployeeVacationBidding      from './pages/EmployeeVacationBidding';
import VacationsBuckets             from './pages/VacationsBuckets';
import VacationPreferenceSubmission from './pages/VacationPreferenceSubmission';
import VacationAwardAndOverride     from './pages/VacationAwardAndOverride';
import VacationBidWindowConfig      from './pages/VacationBidWindowConfig';

export default function App() {
  return (
    <Routes>
      <Route path="/"                       element={<BiddingDashboard />} />
      <Route path="/shift-board"            element={<ShiftBoard />} />
      <Route path="/manage"                 element={<ManageBids />} />
      <Route path="/employees"              element={<Employees />} />

      {/* Shift Bidding Module */}
      <Route path="/shift-ingestion"        element={<ShiftIngestion />} />
      <Route path="/shift-bid-windows"      element={<ShiftBidWindows />} />
      <Route path="/shift-define-schedules" element={<ShiftBiddingDefineSchedules />} />
      <Route path="/shift-bidding-monitor" element={<ShiftBiddingMonitor />} /> 
      <Route path="/open-shifts"            element={<OpenShifts />} />
      <Route path="/shift-preferences"      element={<EmployeeShiftPreferences />} />
      <Route path="/shift-bidding"          element={<ShiftBidding />} />
      <Route path="/shift-award"            element={<ShiftAward />} />

      {/* Overtime Bidding Module */}
      <Route path="/staffing-levels"        element={<StaffingLevels />} />
      <Route path="/overtime-shifts-view"   element={<OvertimeShiftsView />} />
      <Route path="/rule-sets"              element={<RuleSetManager />} />
      <Route path="/rule-sets-view"         element={<RuleSetsView />} />
      <Route path="/ot-bidding-process"     element={<OtBiddingProcess />} />

      {/* Vacation Bidding Module */}
      <Route
        path="/employee-vacation-bidding"
        element={<EmployeeVacationBidding />}
      />
      <Route
        path="/vacations-buckets"
        element={<VacationsBuckets />}
      />
      <Route
        path="/vacation-preference-submission"
        element={<VacationPreferenceSubmission />}
      />
      <Route
        path="/vacation-award-override"
        element={<VacationAwardAndOverride />}
      />
      <Route
        path="/vacation-window-config"
        element={<VacationBidWindowConfig />}
      />

      {/* catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
