# Database Directory

This directory contains raw SQL files for defining the schema, seed data, indexes, constraints, and enums for the MySQL 8 database. 

## Files
- `schema.sql`: Core table definitions.
- `seed.sql`: Initial dataset for testing/development.
- `indexes.sql`: Database index definitions.
- `constraints.sql`: Foreign keys and other constraints.
- `enums.sql`: SQL enums or lookup table inserts.

*Note: No ORMs (like Prisma or Sequelize) are used per the architectural guidelines. Execute these SQL scripts directly against your MySQL instance.*
