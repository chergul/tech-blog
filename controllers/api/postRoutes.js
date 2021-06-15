const router = require('express').Router();
const { Post } = require('../../models');

// GET all posts to homepage
router.get('/', async (req, res) => {
  try {
    const postData = await Post.findAll({
      include:[
        {
        model: Post,
        attributes: [
          'id',
          'title',
          'content',
          'date',
        ],
        },
      ],
    });
    const posts = postData.map((post) =>
      post.get({ plain: true })
    );
    res.render('homepage');
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// GET one post
router.get('/post/:id', async (req, res) => {
  try {
    const dbPostData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: Post,
          attributes: [
            'id',
            'title',
            'content',
            'date',
          ],
        },
      ],
    });

    const post = dbPostData.get({ plain: true });
    res.render('post', { post });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//POST route
router.post('/', async (req, res) => {
  try {
    const newPost = await Post.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newPost);
  } catch (err) {
    res.status(400).json(err);
  }
});

//DELETE route
router.delete('/:id', async (req, res) => {
  try {
    const postData = await Post.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!postData) {
      res.status(404).json({ message: "We couldn't find the post that you are looking for!" });
      return;
    }

    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;
