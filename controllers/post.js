//
//  SELECT * FROM posts AS p JOIN users AS u ON (u.id = p.userId)
//  Modo simplificado:
//  
//  SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId);
//
//