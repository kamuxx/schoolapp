# Changelog

All notable changes to this project will be documented in this file.
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed
- Error 404 en ruta `/filiacion/carga-horaria/docente/{id}/data` mediante normalización de rutas a español y actualización de endpoint en frontend.
- Error de validación en `GetTeacherAssignmentsRequest` al vincular correctamente el parámetro de ruta `employeeId`.
- `TypeError` en `GetTeacherAssignmentsUseCase` corrigiendo el acceso al ID del usuario a través de la relación del modelo `Employee`.

### Added
- Visualización de cantidad de estudiantes por sección y total por nivel en la Ficha del Docente facilitando el monitoreo de carga académica.
- README.md profesional con stack completo, arquitectura, entidades de dominio, roles, comandos de desarrollo y matriz de tests críticos.
- CHANGELOG.md inicial del proyecto.

## [0.1.0] - 2026-02-26

### Added
- Scaffold inicial del proyecto con Laravel 12 + Inertia.js v2 + React 19 + TypeScript.
- Configuración de Tailwind CSS v4 vía plugin de Vite.
- Panel administrativo con Filament v5.
- Autenticación con Laravel Fortify.
- Routing tipado con Laravel Wayfinder.
- Suite de tests con PestPHP configurada.
- Script `composer dev` para levantar servidor + queue + Vite en paralelo.
- Script `composer setup` para instalación desde cero.
- Base de datos SQLite configurada para entorno de desarrollo.
- Seeders iniciales para menú de navegación (`MenuItemSeeder`).
