// lib/features/pet_school/data/models/course_response.dart

class CourseResponse {
  final bool success;
  final String message;
  final CourseData data;

  CourseResponse({
    required this.success,
    required this.message,
    required this.data,
  });

  factory CourseResponse.fromJson(final Map<String, dynamic> json) {
    return CourseResponse(
      success: json['success'] as bool,
      message: json['message'] as String,
      data: CourseData.fromJson(json['data'] as Map<String, dynamic>),
    );
  }
}

class CourseData {
  final List<Course> data;
  final Meta meta;

  CourseData({required this.data, required this.meta});

  factory CourseData.fromJson(final Map<String, dynamic> json) {
    return CourseData(
      data: (json['data'] as List<dynamic>)
          .map((final e) => Course.fromJson(e as Map<String, dynamic>))
          .toList(),
      meta: Meta.fromJson(json['meta'] as Map<String, dynamic>),
    );
  }
}

class Course {
  final String id;
  final String schoolId;
  final String name;
  final String details;
  final String thumbnailImg;
  final DateTime startingTime;
  final DateTime endingTime;
  final int price;
  final int availableSeats;
  final String courseFor;
  final String discount;
  final int duration;
  final String trainerId;
  final String courseLevel;
  final DateTime createdAt;
  final DateTime updatedAt;
  final School school;
  final Trainer trainer;

  Course({
    required this.id,
    required this.schoolId,
    required this.name,
    required this.details,
    required this.thumbnailImg,
    required this.startingTime,
    required this.endingTime,
    required this.price,
    required this.availableSeats,
    required this.courseFor,
    required this.discount,
    required this.duration,
    required this.trainerId,
    required this.courseLevel,
    required this.createdAt,
    required this.updatedAt,
    required this.school,
    required this.trainer,
  });

  factory Course.fromJson(final Map<String, dynamic> json) {
    return Course(
      id: json['id'] as String,
      schoolId: json['schoolId'] as String,
      name: json['name'] as String,
      details: json['details'] as String,
      thumbnailImg: json['thumbnailImg'] as String,
      startingTime: DateTime.parse(json['startingTime'] as String),
      endingTime: DateTime.parse(json['endingTime'] as String),
      price: json['price'] as int,
      availableSeats: json['availableSeats'] as int,
      courseFor: json['courseFor'] as String,
      discount: json['discount'] as String,
      duration: json['duration'] as int,
      trainerId: json['trainerId'] as String,
      courseLevel: json['courseLevel'] as String,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
      school: School.fromJson(json['school'] as Map<String, dynamic>),
      trainer: Trainer.fromJson(json['trainer'] as Map<String, dynamic>),
    );
  }
}

class School {
  final String id;
  final String name;
  final int rating;

  School({required this.id, required this.name, required this.rating});

  factory School.fromJson(final Map<String, dynamic> json) {
    return School(
      id: json['id'] as String,
      name: json['name'] as String,
      rating: json['rating'] as int,
    );
  }
}

class Trainer {
  final String id;
  final String name;

  Trainer({required this.id, required this.name});

  factory Trainer.fromJson(final Map<String, dynamic> json) {
    return Trainer(
      id: json['id'] as String,
      name: json['name'] as String,
    );
  }
}

class Meta {
  final int total;
  final int page;
  final int limit;
  final int totalPages;

  Meta({
    required this.total,
    required this.page,
    required this.limit,
    required this.totalPages,
  });

  factory Meta.fromJson(final Map<String, dynamic> json) {
    return Meta(
      total: json['total'] as int,
      page: json['page'] as int,
      limit: json['limit'] as int,
      totalPages: json['totalPages'] as int,
    );
  }
}
