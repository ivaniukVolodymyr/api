-- Stored procedures:

DROP PROCEDURE IF EXISTS data.create_meal;

DELIMITER $$
CREATE PROCEDURE data.create_meal
(
    IN coachId BIGINT,
    IN name NVARCHAR(60),
    IN procedureText NVARCHAR(600),
    IN locale NVARCHAR(60)
)
COMMENT 'OrganizationMethods' 
BEGIN
   SET @id = IFNULL((SELECT MAX(id)+1 FROM data.meal),0);
   SET @addedDate = NOW();
	-- Create proper meal  
   INSERT IGNORE INTO data.meal(id, procedure_text, created_at)
   VALUES (@id, procedureText, @addedDate);

   INSERT IGNORE INTO data.meal_i18n(id, locale, name, created_at)
   VALUES (@id, locale, name, @addedDate);
   -- Create proper record for coach

   INSERT IGNORE INTO data.coach_meal (coach_id, id, added_at)
   VALUES (coachId, @id, @addedDate);

   SELECT @id AS id;	

END $$
DELIMITER ;

-- Schema and tables creation:

CREATE SCHEMA IF NOT EXISTS data;

CREATE TABLE IF NOT EXISTS data.meal (
    id BIGINT NOT NULL,
    procedure_text NVARCHAR(1000) NOT NULL,
    created_at DATETIME,
    PRIMARY KEY (id ASC),
    INDEX m_procedure_text_IX (procedure_text ASC)
);

CREATE TABLE IF NOT EXISTS data.meal_i18n (
    id BIGINT NOT NULL,
    locale NVARCHAR(60) NOT NULL,
    name NVARCHAR(60) NOT NULL,
    created_at DATETIME,
    PRIMARY KEY (id ASC, locale ASC),
    INDEX m_name_IX (name ASC)
);

CREATE TABLE IF NOT EXISTS data.coach_meal (
    coach_id BIGINT NOT NULL,
    id BIGINT NOT NULL,
    added_at DATETIME,
    PRIMARY KEY (coach_id ASC, id ASC)
);


CREATE TABLE IF NOT EXISTS data.coach (
    coach_id BIGINT NOT NULL,
    full_name NVARCHAR(120) NOT NULL,
    created_at DATETIME,
    PRIMARY KEY (coach_id ASC),
    INDEX c_full_name_IX (full_name ASC)
);


-- queries can be found in file:
  \models\meals.js