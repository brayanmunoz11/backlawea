const express = require("express");
const router = express.Router();
const pool = require("../database");

router.get("/publicar",  (req, res,next) => {

  res.status(200).json({
    gawr: 'gura'
  })
});

router.post("/publicar", async (req, res,next) => {
try {
    
    const {
        titulo,
        fechasubida,
        descripcion,
        stock = 1,
        precio,
        autor,
        estado = 1,
        idGenero = 4,
        idEspecie = 44,
      } = req.body;
      const nuevoLibro = {
        titulo,
        fechasubida,
        descripcion,
        stock,
        precio,
        autor,
        estado,
        idGenero,
        idEspecie,
        dni: req.user.dni,
      };
    
    
      
      await pool.query("INSERT INTO LIBRO SET ?", [nuevoLibro]);
      res.status(200).json({
        message:"Libro insertado"
      })
    
} catch (error) {
    next(error);
}
    
});

router.get("/mislibros",  async (req, res,next) => {
  try {
    const {dni} = req.body;
    const libro = await pool.query(
        "SELECT * FROM LIBRO WHERE ESTADO=1 and dni = ?",
        [dni]
      );
    
      res.status(200).json({
        libro
    
      })
  } catch (error) {
      next(error)
  }
  
});

router.get("/change/:idLibro",  async (req, res,next) => {
  try {
    const { idLibro } = req.params;
    const {dni} = req.body;
    await pool.query("update libro set estado = 2 where idLibro=? and dni=?", [
      idLibro,
      dni,
    ]);

    res.status(200).json({
        message:"Libro Cambiado"
    })
      
  } catch (error) {
      next(error)
  }

});

router.get("/editbook/:idLibro",  async (req, res,next) => {
  try {
    const { idLibro } = req.params;
    const {dni} = req.body;
    const libro = await pool.query(
      "select*from libro where idLibro=? and dni=?",
      [idLibro, dni]
    );
    
    
    res.status(200).json({
        libro:libro[0]
    })

  } catch (error) {
    next(error)
  }
});


router.get("/deletebook/:idLibro",  async (req, res, next) => {
  try {
    const { idLibro } = req.params;
    await pool.query("delete from libro where idLibro = ?",[idLibro]);
    res.redirect("/links/mislibros");

    res.status(200).json({
        message:"Libro eliminado"
    })
      
  } catch (error) {
      next(error)
  }

});


router.post("/editbook/:idLibro",  async (req, res,next) => {

  try {
        const { idLibro } = req.params;
        const { titulo, descripcion, stock, precio, autor } = req.body;
        const actLibro = {
            titulo,
            descripcion,
            stock,
            precio,
            autor,
        };

        console.log(actLibro);
        await pool.query("update libro set ? where idLibro = ?", [actLibro, idLibro]);
        req.flash("success", "Libro actualizado satisfactoriamente");
        res.redirect("/links/mislibros");

        res.status(200).json({
        message:"Libro update"
        })
      
  } catch (error) {
      next(error)
  }

});





router.get("/edituser/datos/:dni", async (req, res, next) => {

  try {

    const { dni } = req.params;
    const user = await pool.query("select*from persona where dni=?", [dni]);
    const distrito = await pool.query(
      "select id_distrito, des_distrito from distrito"
    );
    res.render("links/modificarperfil", { edituser: user[0], distrito });
      
  } catch (error) {
    next(error)
  }  

  
});





router.post("/edituser/datos/:dni",  async (req, res, next) => {
  try {
    const { dni } = req.params;

    const {
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      direccion,
      telefono,
      correo_electronico,
      genero,
      fecha_nac,
      usuario,
      id_distrito,
      wsp,
      twt,
      ig,
      fb,
      wtp,
    } = req.body;
  
    let foto;
    let subirDireccion;
  
    if (req.files && Object.keys(req.files).length != 0) {
      foto = req.files.foto;
      subirDireccion = path.join(__dirname, "../", "public", "upload", foto.name);
  
      foto.mv(subirDireccion, async () => {
        await pool.query("UPDATE persona SET foto=? WHERE dni=?", [
          foto.name,
          dni,
        ]);
      });
    }
  
    if (
      expresiones.nombre.test(nombre) &&
      expresiones.nombre.test(apellidoPaterno) &&
      expresiones.apellidos.test(apellidoMaterno) &&
      expresiones.correo.test(correo_electronico) &&
      expresiones.direccion.test(direccion) &&
      (telefono.length == 0 || expresiones.celular.test(telefono)) &&
      (usuario.length == 0 || expresiones.usuario.test(usuario))
    ) {
      await pool.query(
        "update persona set nombre=?,apellidoPaterno=?,apellidoMaterno=?,direccion=?,telefono=?,correo_electronico=?,genero=?,usuario=?,fecha_nac=?,id_distrito=? where dni = ?",
        [
          nombre,
          apellidoPaterno,
          apellidoMaterno,
          direccion,
          telefono,
          correo_electronico,
          genero,
          usuario,
          fecha_nac,
          id_distrito,
          dni,
        ]
      );
  
      await pool.query(
        "update usuarioredsocial set link_wsp=?,link_fb=?,link_twt=?,link_ig=?,link_wtp=? where dni = ?",
        [wsp, twt, ig, fb, wtp, dni]
      );
  
      req.flash("success", "Datos actualizados satisfactoriamente");
    } else {
      req.flash("message", "Error en algunos de los campos");
    }
  
    res.redirect(dni);

  } catch (error) {
    
    next(error)

  }

});




router.post("/edituser/contra/:dni",  async (req, res,next) => {

    try {
        const { dni } = req.params;
        const { contraActual, contraNueva, contraConfirmar } = req.body;
      
        const row = await pool.query("SELECT * FROM persona WHERE dni=?", [dni]);
      
        const user = row[0];
      
        const validarPassword = await helpers.comparaPassword(
          contraActual,
          user.password
        );
      
        if (validarPassword) {
          if (expresiones.password.test(contraNueva)) {
            if (contraNueva === contraConfirmar) {
              /* const contraEncriptada = await helpers.encryptPassword(contraNueva);
              await pool.query("UPDATE persona SET password=? WHERE dni=?", [
                contraEncriptada,
                dni,
              ]);
              console.log(contraEncriptada); */
              req.flash("success", "Contraseña actualizada satisfactoriamente");
              console.log("Exito");
            } else {
              req.flash("message", "Las contraseñas no son iguales");
              console.log("Las contraseñas no son iguales");
            }
          } else {
            req.flash("message", "Error en los campos");
            console.log("Error en los campos");
          }
        } else {
          req.flash("message", "La contraseña actual no coincide");
          console.log("La contraseña actual no coincide");
        }
      
        res.redirect("back");
        
    } catch (error) {
        next(error)
    }

});

module.exports = router;