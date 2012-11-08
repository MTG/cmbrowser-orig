SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL';


-- -----------------------------------------------------
-- Table `compmusic`.`collection`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `compmusic`.`collection` (
  `mbid` VARCHAR(36) NOT NULL ,
  `name` VARCHAR(45) NULL ,
  PRIMARY KEY (`mbid`) )
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci;


-- -----------------------------------------------------
-- Table `compmusic`.`artist`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `compmusic`.`artist` (
  `uuid` VARCHAR(36) NOT NULL ,
  `mbid` VARCHAR(36) NULL ,
  `name` VARCHAR(255) NOT NULL ,
  `type` VARCHAR(45) NULL DEFAULT 'Person' ,
  `alias` TEXT NULL ,
  `gender` VARCHAR(24) NULL DEFAULT 'unknown' ,
  `country` VARCHAR(24) NULL DEFAULT 'unknown' ,
  `birthdate` DATE NULL ,
  `collection_mbid` VARCHAR(36) NULL ,
  PRIMARY KEY (`uuid`) ,
  INDEX `fk_artist_1` (`collection_mbid` ASC) ,
  CONSTRAINT `fk_artist_1`
    FOREIGN KEY (`collection_mbid` )
    REFERENCES `compmusic`.`collection` (`mbid` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci;


-- -----------------------------------------------------
-- Table `compmusic`.`release_group`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `compmusic`.`release_group` (
  `uuid` VARCHAR(45) NOT NULL ,
  `mbid` VARCHAR(36) NULL ,
  `title` TEXT NOT NULL ,
  `type` VARCHAR(45) NULL ,
  `first_release_date` VARCHAR(24) NULL ,
  `collection_mbid` VARCHAR(36) NULL ,
  PRIMARY KEY (`uuid`) ,
  INDEX `fk_release_group_1` (`collection_mbid` ASC) ,
  CONSTRAINT `fk_release_group_1`
    FOREIGN KEY (`collection_mbid` )
    REFERENCES `compmusic`.`collection` (`mbid` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci;


-- -----------------------------------------------------
-- Table `compmusic`.`release`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `compmusic`.`release` (
  `uuid` VARCHAR(45) NOT NULL ,
  `mbid` VARCHAR(36) NULL ,
  `title` TEXT NOT NULL ,
  `status` VARCHAR(45) NULL ,
  `quality` VARCHAR(45) NULL ,
  `date` VARCHAR(24) NULL ,
  `artist_uuid` VARCHAR(36) NULL ,
  `release_group_uuid` VARCHAR(36) NULL ,
  `collection_mbid` VARCHAR(36) NULL ,
  PRIMARY KEY (`uuid`) ,
  INDEX `fk_release_1` (`artist_uuid` ASC) ,
  INDEX `fk_release_2` (`release_group_uuid` ASC) ,
  INDEX `fk_release_3` (`collection_mbid` ASC) ,
  CONSTRAINT `fk_release_1`
    FOREIGN KEY (`artist_uuid` )
    REFERENCES `compmusic`.`artist` (`uuid` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_release_2`
    FOREIGN KEY (`release_group_uuid` )
    REFERENCES `compmusic`.`release_group` (`uuid` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_release_3`
    FOREIGN KEY (`collection_mbid` )
    REFERENCES `compmusic`.`collection` (`mbid` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci;


-- -----------------------------------------------------
-- Table `compmusic`.`recording`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `compmusic`.`recording` (
  `uuid` VARCHAR(36) NOT NULL ,
  `mbid` VARCHAR(36) NULL ,
  `title` TEXT NOT NULL ,
  `length` VARCHAR(45) NULL ,
  `release_uuid` VARCHAR(45) NULL ,
  `artist_uuid` VARCHAR(36) NULL ,
  `collection_mbid` VARCHAR(36) NULL ,
  PRIMARY KEY (`uuid`) ,
  INDEX `fk_recording_1` (`artist_uuid` ASC) ,
  INDEX `fk_recording_3` (`collection_mbid` ASC) ,
  INDEX `fk_recording_4` (`release_uuid` ASC) ,
  CONSTRAINT `fk_recording_1`
    FOREIGN KEY (`artist_uuid` )
    REFERENCES `compmusic`.`artist` (`uuid` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_recording_3`
    FOREIGN KEY (`collection_mbid` )
    REFERENCES `compmusic`.`collection` (`mbid` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_recording_4`
    FOREIGN KEY (`release_uuid` )
    REFERENCES `compmusic`.`release` (`uuid` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci;


-- -----------------------------------------------------
-- Table `compmusic`.`work`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `compmusic`.`work` (
  `uuid` VARCHAR(36) NOT NULL ,
  `mbid` VARCHAR(36) NULL ,
  `title` TEXT NULL ,
  `collection_mbid` VARCHAR(36) NULL ,
  PRIMARY KEY (`uuid`) ,
  INDEX `fk_work_2` (`collection_mbid` ASC) ,
  CONSTRAINT `fk_work_2`
    FOREIGN KEY (`collection_mbid` )
    REFERENCES `compmusic`.`collection` (`mbid` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci;


-- -----------------------------------------------------
-- Table `compmusic`.`tag`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `compmusic`.`tag` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `tag` VARCHAR(255) NOT NULL ,
  `category` VARCHAR(255) NOT NULL DEFAULT 'unknown' ,
  PRIMARY KEY (`id`) ,
  UNIQUE INDEX `tag_UNIQUE` (`tag` ASC, `category` ASC) )
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci;


-- -----------------------------------------------------
-- Table `compmusic`.`relation`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `compmusic`.`relation` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `uuid_entity1` VARCHAR(36) NOT NULL ,
  `uuid_entity2` VARCHAR(36) NOT NULL ,
  `type` VARCHAR(45) NOT NULL ,
  `attribute` VARCHAR(45) NOT NULL DEFAULT 'unknown' ,
  PRIMARY KEY (`id`) ,
  UNIQUE INDEX `relation_UNIQUE` (`uuid_entity1` ASC, `uuid_entity2` ASC, `type` ASC, `attribute` ASC) )
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci;


-- -----------------------------------------------------
-- Table `compmusic`.`annotation`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `compmusic`.`annotation` (
  `uuid_entity` VARCHAR(36) NOT NULL ,
  `tag_id` INT NOT NULL ,
  `score` INT NULL DEFAULT 1 ,
  PRIMARY KEY (`uuid_entity`, `tag_id`) ,
  INDEX `fk_annotation_1` (`tag_id` ASC) ,
  CONSTRAINT `fk_annotation_1`
    FOREIGN KEY (`tag_id` )
    REFERENCES `compmusic`.`tag` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci;



SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
