import 'package:reactive_forms/reactive_forms.dart';

/// Profile form for updating user information.
FormGroup profileForm({
  final String? initialName,
  final String? initialEmail,
  final String? initialPhone,
  final String? initialBio,
}) {
  return FormGroup({
    'name': FormControl<String>(
      value: initialName,
      validators: [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
      ],
    ),
    'email': FormControl<String>(
      value: initialEmail,
      validators: [Validators.required, Validators.email],
    ),
    'phone': FormControl<String>(
      value: initialPhone,
      validators: [Validators.pattern(r'^\+?[\d\s-]{10,}$')],
    ),
    'bio': FormControl<String>(
      value: initialBio,
      validators: [Validators.maxLength(500)],
    ),
  });
}

/// Contact/feedback form.
FormGroup contactForm() {
  return FormGroup({
    'name': FormControl<String>(validators: [Validators.required]),
    'email': FormControl<String>(
      validators: [Validators.required, Validators.email],
    ),
    'subject': FormControl<String>(validators: [Validators.required]),
    'message': FormControl<String>(
      validators: [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(1000),
      ],
    ),
  });
}

/// Address form.
FormGroup addressForm({
  final String? initialStreet,
  final String? initialCity,
  final String? initialState,
  final String? initialZip,
  final String? initialCountry,
}) {
  return FormGroup({
    'street': FormControl<String>(
      value: initialStreet,
      validators: [Validators.required],
    ),
    'city': FormControl<String>(
      value: initialCity,
      validators: [Validators.required],
    ),
    'state': FormControl<String>(
      value: initialState,
      validators: [Validators.required],
    ),
    'zip': FormControl<String>(
      value: initialZip,
      validators: [
        Validators.required,
        Validators.pattern(r'^\d{5}(-\d{4})?$'),
      ],
    ),
    'country': FormControl<String>(
      value: initialCountry ?? 'US',
      validators: [Validators.required],
    ),
  });
}
