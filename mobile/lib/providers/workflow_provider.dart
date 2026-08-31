import 'dart:async';
import 'package:flutter/material.dart';
import 'package:speech_to_text/speech_to_text.dart' as stt;
import '../api/orka_api_client.dart';
import '../models/workflow.dart';
import '../models/result.dart';

class WorkflowProvider extends ChangeNotifier {
  int _currentTab = 0;
  int get currentTab => _currentTab;

  void setTab(int index) {
    _currentTab = index;
    notifyListeners();
  }

  String _operatingMode = 'COPILOT';
  String get operatingMode => _operatingMode;

  void toggleOperatingMode() {
    _operatingMode = _operatingMode == 'COPILOT' ? 'AUTOPILOT' : 'COPILOT';
    notifyListeners();
  }

  // Voice to text
  final stt.SpeechToText _speech = stt.SpeechToText();
  bool _isListening = false;
  bool get isListening => _isListening;
  String _voiceText = '';
  String get voiceText => _voiceText;

  Future<void> toggleVoiceListening(Function(String) onResult) async {
    if (!_isListening) {
      bool available = await _speech.initialize(
        onStatus: (status) {
          if (status == 'done' || status == 'notListening') {
            _isListening = false;
            notifyListeners();
          }
        },
        onError: (errorNotification) {
          _isListening = false;
          notifyListeners();
        },
      );

      if (available) {
        _isListening = true;
        notifyListeners();
        _speech.listen(
          onResult: (val) {
            _voiceText = val.recognizedWords;
            onResult(_voiceText);
            notifyListeners();
          },
        );
      }
    } else {
      _isListening = false;
      _speech.stop();
      notifyListeners();
    }
  }

  // Workflow State
  WorkflowExecution? _execution;
  WorkflowExecution? get execution => _execution;

  ExecutionResult? _result;
  ExecutionResult? get result => _result;

  bool _isLoading = false;
  bool get isLoading => _isLoading;

  String? _errorMessage;
  String? get errorMessage => _errorMessage;

  Timer? _stepTimer;

  Future<void> startExecution(String goal) async {
    if (goal.trim().isEmpty) return;

    _isLoading = true;
    _errorMessage = null;
    _result = null;
    notifyListeners();

    try {
      _execution = await OrkaApiClient.executeOutcome(goal, mode: _operatingMode);
      _isLoading = false;
      notifyListeners();

      _startStepLoop();
    } catch (e) {
      _isLoading = false;
      _errorMessage = e.toString().replaceAll('Exception: ', '');
      notifyListeners();
    }
  }

  void _startStepLoop() {
    _stepTimer?.cancel();
    _stepTimer = Timer.periodic(const Duration(milliseconds: 450), (timer) async {
      if (_execution == null || _execution!.status == 'completed' || _execution!.status == 'failed' || _execution!.status == 'waiting_approval') {
        timer.cancel();
        if (_execution?.status == 'completed') {
          if (_execution?.result != null) {
            _result = _execution!.result;
            notifyListeners();
          } else {
            _fetchFinalResult();
          }
        }
        return;
      }

      try {
        _execution = await OrkaApiClient.advanceWorkflow(_execution!.id);
        if (_execution?.result != null) {
          _result = _execution!.result;
        }
        notifyListeners();

        if (_execution!.status == 'completed' || _execution!.status == 'waiting_approval' || _execution!.status == 'failed') {
          timer.cancel();
          if (_execution!.status == 'completed') {
            if (_result == null) {
              _fetchFinalResult();
            }
          }
        }
      } catch (e) {
        timer.cancel();
      }
    });
  }

  Future<void> approveStep({String? to, String? subject, String? body}) async {
    if (_execution == null || _execution!.approvalRequest == null) return;

    try {
      final req = _execution!.approvalRequest!;
      _execution = await OrkaApiClient.approveStep(
        _execution!.id,
        req.stepId,
        to: to,
        subject: subject,
        body: body,
      );
      if (_execution?.result != null) {
        _result = _execution!.result;
      }
      notifyListeners();

      _startStepLoop();
    } catch (e) {
      _errorMessage = 'Approval failed: $e';
      notifyListeners();
    }
  }

  Future<void> _fetchFinalResult() async {
    if (_execution == null) return;
    try {
      _result = await OrkaApiClient.getResult(_execution!.id);
      notifyListeners();
    } catch (_) {}
  }

  void resetWorkflow() {
    _stepTimer?.cancel();
    _execution = null;
    _result = null;
    _errorMessage = null;
    notifyListeners();
  }
}
