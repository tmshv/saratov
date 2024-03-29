# Саратов ОПР

- [serverkb.strelka.com](http://serverkb.strelka.com)
- [saratov.tmshv.com](https://saratov.tmshv.com)

## Modified Data for CDN

- 20180226/Buildings/tileset.json
- 20171223/Dataset/tileset.json

## Update

1. Modify code in `./Source`
2. Make a commit
3. Push it to [git.tmshv.com](https://git.tmshv.com) 
4. Wait until it be builded by [drone.tmshv.com](https://drone.tmshv.com)
5. SSH to saratov.tmshv.com server
6. Cd to `~/Saratov` folder
7. Load last build to docker with `docker load -i <file>`
8. Remove previous container
9. Run new container with `./run`

## Change tile provider token

1. Open config file (Data/config.json)
2. Find "imagery" section
3. Change imagery[].apiKey field

## Links

- [Convert 3D models to ECEF?](https://knowledge.safe.com/questions/25220/convert-3d-models-to-ecef.html)
- [Baking Ambient Occlusion in the glTF Pipeline](https://cesium.com/blog/2016/08/08/ambient-occlusion/)
- [gltf-b3dm-convertor](https://github.com/daniel-hilton/gltf-b3dm-convertor)
- [py3dtiles](https://github.com/Oslandia/py3dtiles)
- [What is Rhino.Python?](http://developer.rhino3d.com/guides/rhinopython/what-is-rhinopython/)
- [Rhino.Python Guides](http://developer.rhino3d.com/guides/rhinopython/)
- [Export layers as obj from Rhino3d](https://stackoverflow.com/questions/29401951/export-layers-as-obj-from-rhino3d)
- [Как сверстать такую плашку с размытием фона?](https://bureau.ru/bb/soviet/20180201/)
