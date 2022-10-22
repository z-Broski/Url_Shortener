CREATE TABLE IF NOT EXISTS urls (
  short_url varchar(40) NOT NULL PRIMARY KEY,
  long_url varchar(1000) NOT NULL
);

CREATE TABLE IF NOT EXISTS url_stats (
  id SERIAL PRIMARY KEY,
  short_url varchar(40) NOT NULL,
  event_date DATE NOT NULL DEFAULT CURRENT_DATE,
  click_count INT NOT NULL,
  UNIQUE (short_url, event_date)
);