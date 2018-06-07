import os
import scriptcontext
import rhinoscriptsyntax as rs

export_layer_name = "Default"
export_textures = True # False

fileName = rs.DocumentName()
dir_path = os.path.join(rs.DocumentPath().rstrip(fileName), 'Output')

try:
    pass
    os.makedirs(dir_path)
except:
    print('Failed to makedirs to {}'.format(dir_path))


def layerNames(sort=False):
    rc = []
    for layer in scriptcontext.doc.Layers:
        if not layer.IsDeleted: rc.append(layer.FullPath)
    if sort: rc.sort()
    return rc


def option_value(value):
    if value:
        return '_Yes'
    else:
        return '_No'

def option_density(value):
    return '_Density=0 '

def option_mat_def(value):
    v = option_value(value)
    return '_ExportMaterialDefinitions={} '.format(v)

def option_pack_textures(value):
    v = option_value(value)
    return "_PackTextures={} ".format(v)

def get_obj_settings():
    e_str = ""
#    e_str+= "_SaveTextures=_Yes "
    e_str+= "_Geometry=_Mesh "
#    e_str+= "_EndOfLine=LF "
#    e_str+= "_ExportRhinoObjectNames=_ExportObjectsAsOBJGroups "
    e_str+= "_ExportMeshTextureCoordinates=_Yes "
    e_str+= "_ExportMeshVertexNormals=_Yes "
#    e_str+= "_CreateNGons=_No "
    e_str+= option_mat_def(True)
    e_str+= "_YUp=_Yes "
#    e_str+= "_WrapLongLines=_Yes "
#    e_str+= "_VertexWelding=_Unmodified "
#    e_str+= "_VertexWelding=_Welded "
#    e_str+= "_WritePrecision=4 "
    e_str+= "_Enter "

    e_str+= "_DetailedOptions "
    
#    e_str+= "_JaggedSeams=_No "
    e_str+= option_pack_textures(True)
#    e_str+= "_Refine=_Yes "
#    e_str+= "_SimplePlane=_No "

#    e_str+= "_AdvancedOptions "
#    e_str+= "_Angle=50 "
#    e_str+= "_AspectRatio=0 "
#    e_str+= "_Distance=0.0"
#    e_str+= "_Density=0 "
#    e_str+= "_Density=0.45 "
#    e_str+= "_Grid=0 "
#    e_str+= "_MaxEdgeLength=0 "
#    e_str+= "_MinEdgeLength=0.0001 "

    e_str+= "_Enter _Enter"

    return e_str

def get_layer(name):
    layer = scriptcontext.doc.Layers.FindByFullPath(name, True)
    if layer >= 0:
        return scriptcontext.doc.Layers[layer]
    return None
        
def initExportByLayer(layerName):
    rs.EnableRedraw(False)
    layer = get_layer(layerName)
    if not layer:
        print('Layer not found')
        return

    objs = scriptcontext.doc.Objects.FindByLayer(layerName)
    objs = [x for x in objs if x.Name]        
    for obj in objs:
        name = obj.Name
        saveObjectToFile(name, obj)
    rs.EnableRedraw(True)

def get_command(name):
    settings = get_obj_settings()
    name = "".join(name.split(" "))
    file_prefix = ''
    file_name = file_prefix + name + '.obj'
    file_path = os.path.join(dir_path, file_name)

    if export_textures:
        return '-_Export _SaveTextures=_Yes "{}" {}'.format(file_path, settings)
    else:
        return '-_Export "{}" {}'.format(file_path, settings)
    
def saveObjectToFile(name, obj):
    rs.UnselectAllObjects()
    obj.Select(True)
    command = get_command(name)
    rs.Command(command, True)
    print('Exported: %s' % name)


initExportByLayer(export_layer_name)
print ('done')