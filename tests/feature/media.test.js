const app = require(base('main/app'));
const supertest = require('supertest');
const request = supertest(app);

//connect();
//resetDatabase();

const Media = require(base('app/models/Media'));
const index = controller('MediaController').index[1];

describe('MediaController', () => {
  describe('index', () => {
    it('should send the file for the media with the given ID', async () => {
      const media = {
        _id: '123',
        path: '/path/to/media.jpg'
      };

      jest.spyOn(Media, 'findById').mockResolvedValue(media);

      const sendFileSpy = jest.spyOn(global, 'sendFile').mockImplementation();

      const req = { params: { id: '123' } };
      const res = { sendFile: sendFileSpy };

      await index(req, res);

      expect(Media.findById).toHaveBeenCalledWith('123');
      expect(sendFileSpy).toHaveBeenCalledWith(media.path);
    });
  });
});
