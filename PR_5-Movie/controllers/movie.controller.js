const Movie = require("../model/movie.model");
const fs = require('fs');
const path = require('path');

const getMovies = async (req, res) => {
    try {
        const search = req.query.search || '';
        const query = search 
            ? {
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { director: { $regex: search, $options: 'i' } },
                    { genre: { $regex: search, $options: 'i' } }
                ]
            }
            : {};
        
        const movies = await Movie.find(query);
        res.render("index", { movies, search });
    } catch (error) {
        console.error("Error fetching movies:", error);
        res.status(500).send("Error fetching movies");
    }
};

// POST - Add new movie
const addMovie = async (req, res) => {
    try {
        const { title, director, releaseYear, genre, rating } = req.body;
        
        const posterUrl = req.file 
            ? req.file.path.replace('public/', '') 
            : ''
        const newMovie = new Movie({
            title,
            director,
            releaseYear,
            genre,
            rating,
            posterUrl
        });
        
        await newMovie.save();
        res.redirect("/");
    } catch (error) {
        console.error("Error adding movie:", error);
    }
};


const editMoviePage = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).send("Movie not found");
        }
        res.render("edit", { movie });
    } catch (error) {
        console.error("Error fetching movie:", error);
    }
};


const updateMovie = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, director, releaseYear, genre, rating } = req.body;
        

        const existingMovie = await Movie.findById(id);
        if (!existingMovie) {
            return res.status(404).send("Movie not found");
        }
        
        const updateData = {
            title,
            director,
            releaseYear,
            genre,
            rating
        };
        
     
        if (req.file) {
            if (existingMovie.posterUrl) {
                const oldFilePath = path.join(__dirname, '..', 'public', existingMovie.posterUrl);
                fs.unlink(oldFilePath, (err) => {
                    if (err) console.error('Failed to delete old poster:', err);
                });
            }
            
          
            updateData.posterUrl = req.file.path.replace('public/', '');
        }
        
        await Movie.findByIdAndUpdate(id, updateData);
        res.redirect("/");
    } catch (error) {
        console.error("Error updating movie:", error);
        res.status(500).send("Error updating movie");
    }
};

const deleteMovie = async (req, res) => {
    try {
        const { id } = req.params;
    
        const movie = await Movie.findById(id);
        
        if (movie && movie.posterUrl) {
            const filePath = path.join(__dirname, '..', 'public', movie.posterUrl);
            fs.unlink(filePath, (err) => {
                if (err) console.error('Failed to delete poster file:', err);
            });
        }
        
        await Movie.findByIdAndDelete(id);
        res.redirect("/");
    } catch (error) {
        console.error("Error deleting movie:", error);
        res.status(500).send("Error deleting movie");
    }
};

module.exports = {
    getMovies,
    addMovie,
    editMoviePage,
    updateMovie,
    deleteMovie
};