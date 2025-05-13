import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import BiddingDashboard             from './pages/BiddingDashboard';
import ShiftBoard                   from './pages/ShiftBoard';
import ManageBids                   from './pages/ManageBids';
import Employees                    from './pages/Employees';
import StaffingLevels               from './pages/StaffingLevels';
import RuleSetManager               from './pages/RuleSetManager';
import RuleSetsView                 from './pages/RuleSetsView';
import OvertimeShiftsView           from './pages/OvertimeShiftsView';
import OtBiddingProcess             from './pages/OtBiddingProcess';
import EditOvertimeShift            from './pages/EditOvertimeShift';
import EmployeeVacationBidding      from './pages/EmployeeVacationBidding';
import VacationsBuckets             from './pages/VacationsBuckets';
import VacationPreferenceSubmission from './pages/VacationPreferenceSubmission';
import VacationAwardAndOverride     from './pages/VacationAwardAndOverride';
import VacationBidWindowConfig      from './pages/VacationBidWindowConfig';
import OvertimeDashboard        from './pages/OvertimeDashboard';
import OvertimeAdminConsole     from './pages/OvertimeAdminConsole';

export default function App() {
  return (
    <Routes>
      <Route path="/"                           element={<BiddingDashboard />} />
      <Route path="/bidding-dashboard"          element={<BiddingDashboard />} />
      <Route path="/shift-board"                element={<ShiftBoard />} />
      <Route path="/manage"                     element={<ManageBids />} />
      <Route path="/employees"                  element={<Employees />} />
      <Route path="/staffing-levels"            element={<StaffingLevels />} />
      <Route path="/rule-sets"                  element={<RuleSetManager />} />
      <Route path="/rule-sets-view"             element={<RuleSetsView />} />
      <Route path="/overtime-shifts-view"       element={<OvertimeShiftsView />} />
      <Route path="/ot-bidding-process"         element={<OtBiddingProcess />} />
      <Route path="/overtime-shift-edit"        element={<EditOvertimeShift />} />
      <Route path="/employee-vacation-bidding"  element={<EmployeeVacationBidding />} />
      <Route path="/vacations-buckets"          element={<VacationsBuckets />} />
      <Route path="/vacation-preference-submission" element={<VacationPreferenceSubmission />} />
      <Route path="/vacation-award-override"    element={<VacationAwardAndOverride />} />
      <Route path="/vacation-window-config"     element={<VacationBidWindowConfig />} />
      <Route path="/ot-dashboard"           element={<OvertimeDashboard />} />
      <Route path="/ot-admin-console"       element={<OvertimeAdminConsole />} />
      <Route path="*"                           element={<Navigate to="/" replace />} />
    </Routes>
  );
}
