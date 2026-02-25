/// Barrel export for pet sitter feature.
///
/// This consolidates both the clean-architecture data layer (in pet_sitter/)
/// and the legacy provider/controller layer (in pet_setter/).
///
/// The pet_setter directory is a historical typo. All new code should be placed
/// in pet_sitter/ and import from this barrel file.
///
/// TODO: Migrate remaining pet_setter/ files into pet_sitter/ and update
/// all imports across the app.

// Clean architecture data layer
export 'data/repositories/pet_sitter_repository_provider.dart';
export 'data/repositories/pet_sitter_repository_remote.dart';
export 'domain/repositories/pet_sitter_repository.dart';

// Legacy MVC layer
export 'controller/pet_sitter_controller.dart';
export 'model/pet_sitter_model.dart';
