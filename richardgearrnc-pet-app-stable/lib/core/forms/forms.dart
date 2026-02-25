/// Forms module - Reactive Forms integration.
///
/// Provides model-driven form handling using the `reactive_forms` package.
///
/// ## Quick Start
///
/// ```dart
/// import 'package:petzy_app/core/forms/forms.dart';
///
/// final form = loginForm();
///
/// ReactiveForm(
///   formGroup: form,
///   child: Column(
///     children: [
///       ReactiveTextField<String>(formControlName: 'email'),
///       ReactiveTextField<String>(formControlName: 'password'),
///       ReactiveFormConsumer(
///         builder: (_, form, __) => ElevatedButton(
///           onPressed: form.valid ? () => submit(form.value) : null,
///           child: const Text('Submit'),
///         ),
///       ),
///     ],
///   ),
/// );
/// ```
library;

// Re-export reactive_forms (hide Validators to avoid conflict with utils)
export 'package:reactive_forms/reactive_forms.dart' hide Validators;

// Custom validators
export 'custom_validators.dart';

// Auth forms (login, registration, password)
export 'auth_forms.dart';

// Common forms (profile, contact, address)
export 'common_forms.dart';
