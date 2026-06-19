CREATE DATABASE IF NOT EXISTS catalogo_filmes;
USE catalogo_filmes;

DROP TABLE IF EXISTS filmes;

CREATE TABLE filmes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(200) NOT NULL,
  realizador VARCHAR(200) NOT NULL,
  genero VARCHAR(50) NOT NULL,
  ano INT NOT NULL,
  tipo VARCHAR(20) NOT NULL,
  avaliacao INT DEFAULT NULL,
  visto BOOLEAN DEFAULT FALSE
);

INSERT INTO filmes (titulo, realizador, genero, ano, tipo, avaliacao, visto) VALUES
("The Shawshank Redemption", "Frank Darabont", "drama", 1994, "filme", 5, true),
("Inception", "Christopher Nolan", "ficcao", 2010, "filme", 5, true),
("The Dark Knight", "Christopher Nolan", "acao", 2008, "filme", 4, true),
("Parasitas", "Bong Joon-ho", "drama", 2019, "filme", 5, false),
("Spirited Away", "Hayao Miyazaki", "animacao", 2001, "filme", 4, true),
("The Conjuring", "James Wan", "terror", 2013, "filme", 3, false),
("Superbad", "Greg Mottola", "comedia", 2007, "filme", 3, true),
("Planet Earth II", "David Attenborough", "documentario", 2016, "serie", 5, true),
("Breaking Bad", "Vince Gilligan", "drama", 2008, "serie", 5, true),
("Stranger Things", "Duffer Brothers", "ficcao", 2016, "serie", 4, false),
("The Office", "Greg Daniels", "comedia", 2005, "serie", 4, true),
("Dune: Part Two", "Denis Villeneuve", "ficcao", 2024, "filme", NULL, false);
